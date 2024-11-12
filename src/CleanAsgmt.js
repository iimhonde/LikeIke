class CleanAsgmt {
    constructor(canvasApi) {
        this.canvasApi = canvasApi;
    }

    async filterAssignmentsByCourse(courseIds) {
        let filterByClass = await this.canvasApi.defaultFlags(); // Get all assignments
        const filteredAssignments = filterByClass.filter(assignment => !courseIds.includes(assignment.course_id));
        console.log('Filtered Assignments:', filteredAssignments);
        return filteredAssignments;
    }

    async deleteAssignments(assignmentIds) {
        const updatedAssignments = await this.canvasApi.defaultFlags();

        // Filter out the assignments with IDs in assignmentIds
        const remainingAssignments = updatedAssignments.filter(
            assignment => !assignmentIds.includes(assignment.id)
        );
        
        console.log('Assignments after deletion:', remainingAssignments);
        return remainingAssignments;
    }
}

export default CleanAsgmt;
