const generateSubjectCode=(subjectName: string, subjectDuration: string): string=> {

    const normalizedSubjectName = subjectName
      .toUpperCase() 
      .replace(/[^A-Z0-9\s]/g, "")
      .trim();
  
    // Step 2: Extract initials
    const words = normalizedSubjectName.split(/\s+/);
    let initials: string;
    if (words.length > 1) {
      initials = words.map(word => word[0]).join("");
    } else {
      initials = normalizedSubjectName.slice(0, 3); 
    }
  

    const durationMatch = subjectDuration.match(/\d+/);
    const durationValue = durationMatch ? durationMatch[0] : "0"; 
  
    const subjectCode = `${initials}${durationValue}`;
  
    return subjectCode;
  }
  
export default generateSubjectCode;
  