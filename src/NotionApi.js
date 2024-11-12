 /* Logging changes - Last Update 11.08.24
    1) I want to log days, weeks, months => turn each day, week, and month page into a database
        - 

  */





class NotionApi {
    constructor(token, databaseId, proxyUrl) {
        this.token = token;
        this.databaseId = databaseId;
        this.proxyUrl = proxyUrl;
        this.notionHeaders = {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
        };
    }

    
    async findMonthByName(pageName) {
        const searchUrl = `${this.proxyUrl}?url=${encodeURIComponent(`https://api.notion.com/v1/databases/${this.databaseId}/query`)}`;
        
        try {
            const response = await fetch(searchUrl, {
                method: 'POST',
                headers: this.notionHeaders,
                body: JSON.stringify({
                    filter: {
                        property: "Name",
                        title: {
                            contains: pageName
                        }
                    }
                }),
            });

            const data = await response.json();
            if (response.ok && data.results.length > 0) {
                //console.log("Found existing page:", data.results[0].id);
                return data.results[0].id;
            }
        } catch (error) {
            console.error("Error searching for page:", error.message);
        }

        return null;
    }

    async formatDate(date) {
        return date.toLocaleString("en-US", {
            weekday: "short",
            month: "long",
            day: "2-digit",
            year: "numeric"
        });
    }

    async createDayMatrix(courseOptions, dayName) {
        const parentWeek = await this.createWeekPage(dayName);
        const targetUrl = "https://api.notion.com/v1/databases";
        const my_url = `${this.proxyUrl}?url=${encodeURIComponent(targetUrl)}`;
        dayName = await this.formatDate(dayName);
    
        const requestBody = {
            parent: { page_id: parentWeek },
            title: [
                {
                    type: "text",
                    text: { content: dayName }
                }
            ],
            properties: {
                "Assignment Name": {
                    title: {}
                },
                "Due Date": {
                    date: {}
                },
                "Course Name": {
                    select: {
                        options: courseOptions
                    }
                },
                "Urgent": {
                    checkbox: {}
                },
                "Important": {
                    checkbox: {}
                },
                "Status": {
                    select: {
                        options: [
                            { name: "Do First", color: "red" },
                            { name: "Schedule", color: "orange" },
                            { name: "Delegate", color: "yellow" },
                            { name: "Eliminate", color: "green" }
                        ]
                    }
                },
                "Submission Link": {
                    url: {}
                }
            }
        };
    
        try {
            const response = await fetch(my_url, {
                method: 'POST',
                headers: this.notionHeaders,
                body: JSON.stringify(requestBody)
            });
    
            const data = await response.json();
            if (response.ok && data && data.id) {
                console.log("Day matrix created successfully:", data.id);
                return data.id;
            } else {
                console.error("Failed to create day matrix:", data);
                return null;
            }
        } catch (error) {
            console.error("Error creating day matrix:", error.message);
            return null;
        }
    }
    
    
    async addAssignmentsToMatrix(assignments, existingDayPage) {
        const targetUrl = "https://api.notion.com/v1/pages";
        const my_url = `${this.proxyUrl}?url=${encodeURIComponent(targetUrl)}`;
    
        for (const assignment of assignments) {
            const status = this.getStatus(assignment.urgent, assignment.important);
    
            const requestBody = {
                parent: { type: "database_id", database_id: existingDayPage },
                properties: {
                    "Assignment Name": {
                        title: [
                            {
                                type: "text",
                                text: { content: assignment.name }
                            }
                        ]
                    },
                    "Due Date": {
                        date: { start: assignment.due_at }
                    },
                    "Course Name": {
                        select: { name: assignment.course }
                    },
                    "Urgent": {
                        checkbox: assignment.urgent === 1
                    },
                    "Important": {
                        checkbox: assignment.important === 1
                    },
                    "Status": {
                        select: { name: status }
                    },
                    "Submission Link": {
                        url: assignment.html_url
                    }
                }
            };
    
            try {
                const response = await fetch(my_url, {
                    method: 'POST',
                    headers: this.notionHeaders,
                    body: JSON.stringify(requestBody)
                });
    
                const data = await response.json();
                if (response.ok && data && data.id) {
                    console.log("Added assignment to day matrix:", data);
                } else {
                    console.error("Failed to add assignment to day matrix:", data);
                }
            } catch (error) {
                console.error("Error adding assignment to day matrix in Notion:", error.message);
            }
        }
    
        return `https://www.notion.so/${existingDayPage.replaceAll('-', '')}`;
    }
    
    
    // Function to determine the status based on urgency and importance
    getStatus(urgent, important) {
        if (urgent === 1 && important === 1) {
            return "Do First";
        } else if (important === 1) {
            return "Schedule";
        } else if (urgent === 1) {
            return "Delegate";
        } else {
            return "Eliminate";
        }
    }  
   
    async checkIfWithinExistingWeek(today) {
        const targetUrl = "https://api.notion.com/v1/search";
        const url = `${this.proxyUrl}?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({ query: today })  // Modify query if needed
        });
    
        const data = await response.json();
        console.log(`Let's check that ${today} doesn't fall within an existing week` , data.results)
        if (!data.results) {
            console.error("No results found in response");
            return false;
        }
    
        for (const page of data.results) {
            let title = null;
    
            // Handle title extraction based on object type
            if (page.object === "page" && page.properties) {
                title = page.properties.Name?.title?.[0]?.text?.content || 
                        page.properties.title?.title?.[0]?.text?.content;
            } else if (page.object === "database" && page.title) {
                title = page.title[0]?.text?.content;
            }
    
            if (!title) {
                console.log("Skipped a page without a valid Name or title structure.");
                continue;
            }
    
            // Parse start and end dates from title if it matches the expected format
            const [startStr, endStr] = title.split(" - ");
            if (startStr && endStr) {
                const startDate = new Date(startStr);
                const endDate = new Date(endStr);
                today = new Date(today);
                if (today >= startDate && today <= endDate) {
                    console.log(`There is a week entry already encompassing this date: ${page.properties.title?.title?.[0]?.text?.content || 'No Title'}`);
                    return page.id; // Return the ID if within bounds
                }
            }
        }
        console.log("Unique week available")
        return null; 
    }
    
   async searchNotion(query) {
    const targetUrl = "https://api.notion.com/v1/search";
    const url = `${this.proxyUrl}?url=${encodeURIComponent(targetUrl)}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
            query: query
        })
    });

    const data = await response.json();
    console.log(`Search results for ${query} :`, data.results);
    if (response.ok) {
        if (data.results && data.results.length > 0) {
            // Loop through the results to find a matching title
            for (let i = 0; i < data.results.length; i++) {
                const result = data.results[i];
                
                // Handle database objects (e.g., day matrices)
                if (result.object === "database" && result.title) {
                    const titleContent = result.title[0]?.text?.content;
                    if (titleContent === query) {
                        console.log("Matching Found:", result.id, titleContent);
                        return result.id;
                    }
                }
                
                // Handle page objects (e.g., week entries)
                if (result.object === "page" && result.properties) {
                    const titleProperty = result.properties.Name || result.properties.title;
                    const titleContent = titleProperty?.title?.[0]?.text?.content;
                    if (titleContent === query) {
                        console.log("Matching Page Found:", result.id, titleContent);
                        return result.id;
                    }
                }
            }
            console.log("No matching title found for:", query);
            return null;
        } else {
            console.log("No results found for query:", query);
            return null;
        }
    } else {
        console.error("Error searching Notion:", data);
    }
}

    async createWeekPage(currentDate) {
       
        const firstDay = await this.formatDate(currentDate);
        const lastDay = await this.formatDate(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000));

        const weekName = `${firstDay} - ${lastDay}`;

        const parentId = await this.createMonthPage(currentDate);
        const targetUrl = "https://api.notion.com/v1/pages";
        const url = `${this.proxyUrl}?url=${encodeURIComponent(targetUrl)}`;

        const weekExists = await this.checkIfWithinExistingWeek(firstDay);

        if(weekExists){
            console.log("This week entry already exists.Here is the matching id: ", weekExists);
            return weekExists;
            
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.notionHeaders,
                body: JSON.stringify({
                    parent: { type: "page_id", page_id: parentId },
                    properties: {
                        Name: {
                            title: [
                                { text: { content: weekName } }
                            ]
                        }
                    }
                })
            });

            const data = await response.json();
            if (response.ok && data && data.id) {
                console.log("Week page created successfully:", data);
                return data.id;
            } else {
                console.error("Failed to create week page:", data);
                return null;
            }
        } catch (error) {
            console.error("Error creating week page in Notion:", error.message);
            return null;
        }
    }

    async createMonthPage(currentDate) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        const existingPage = await this.findMonthByName(monthName);
        if (existingPage) {
            console.log("Month page already exists. Here is the matching id: ", existingPage);
            return existingPage;
        }

        const targetUrl = "https://api.notion.com/v1/pages";
        const url = `${this.proxyUrl}?url=${encodeURIComponent(targetUrl)}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: this.notionHeaders,
                body: JSON.stringify({
                    parent: { type: "database_id", database_id: this.databaseId },
                    properties: {
                        Name: {
                            title: [
                                { text: { content: monthName } }
                            ]
                        }
                    }
                })
            });

            const data = await response.json();
            if (response.ok && data && data.id) {
                console.log("Month page created successfully:", data);
                return data.id;
            } else {
                console.error("Failed to create month page:", data);
                return null;
            }
        } catch (error) {
            console.error("Error creating month page in Notion:", error.message);
            return null;
        }
    }
}

export default NotionApi;
