class CanvasApi {
    constructor(canvasToken, institutionSD) {
        if (!canvasToken || !institutionSD) {
            throw new Error("Canvas API Token and Subdomain are required.");
        }

        this.canvasToken = canvasToken;
        this.proxyUrl = 'https://success-777.iimhonde.workers.dev/';
        this.baseUrl = `https://${institutionSD}.instructure.com/api/v1/`;  
    }

    getHeaders() {
        return {
            Authorization: `Bearer ${this.canvasToken}`,
            'Content-Type': 'application/json',
        };
    }

    async getActiveCourses() {
        const url = `${this.proxyUrl}?url=${encodeURIComponent(this.baseUrl + 'courses?per_page=50&enrollment_state=active')}`;
        
        try {
            const response = await fetch(url, {
                headers: this.getHeaders(),
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
    
            const courses = await response.json();
            const currentDate = new Date();
            
            const targetDate = new Date('2024-12-14T00:00:00');
            const cleanedTargetDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    
            const activeCourses = courses.filter(course => {
                const startDate = new Date(course.start_at);
                const endDate = new Date(course.end_at);
    
                const cleanedEndDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    
                return startDate <= currentDate && currentDate <= endDate && cleanedTargetDate.getTime() === cleanedEndDate.getTime();
            });
    
            console.log('All Courses:', activeCourses);
            
            return activeCourses;
    
        } catch (error) {
            console.error(`Error in getActiveCourses:`, error.stack);
            throw error;
        }
    }
    
    async retrieveAssignments() {
        const activeCourses = await this.getActiveCourses();
        const currentDate = new Date();
        let allAssignments = [];
    
        for (const course of activeCourses) {
            try {
                const assignmentsUrl = `${this.proxyUrl}?url=${encodeURIComponent(this.baseUrl + 'courses/' + course.id + '/assignments?per_page=100')}`;
                const response = await fetch(assignmentsUrl, {
                    headers: this.getHeaders(),
                });
    
                if (!response.ok) {
                    console.error(`Failed to fetch assignments for course: ${course.name}`);
                    continue;
                }
    
                const assignments = await response.json();
    
                const upcomingAssignments = assignments.filter(assignment => {
                    if (assignment.due_at) {
                        const dueDate = new Date(assignment.due_at);
                        return dueDate >= currentDate;
                    }
                    return false;
                }).map(assignment => ({
                    ...assignment,
                    course_name: course.name
                }));
    
                allAssignments = [...allAssignments, ...upcomingAssignments];
    
            } catch (error) {
                console.error(`Error fetching assignments for course: ${course.name}`, error);
            }
        }
    
        return allAssignments;
    }
    
    async defaultFlags() {
        const allAssignments = await this.retrieveAssignments();
        const currentDate = new Date();
    
        const updatedAssignments = allAssignments.map(assignment => {
            const dueDate = new Date(assignment.due_at);
            const dayDiff = (dueDate - currentDate) / (1000 * 3600 * 24);
            let priority;
    
            if (dayDiff <= 3) {
                priority = 4;
            } else if (dayDiff > 3 && dayDiff < 8) {
                priority = 3;
            } else if (dayDiff >= 8 && dayDiff < 14) {
                priority = 2;
            } else {
                priority = 1;
            }
    
            return {
                ...assignment,
                priority: priority
            };
        });
    
        console.log('All Assignments with Priority:', updatedAssignments);
        return updatedAssignments;
    }
}

export default CanvasApi;
