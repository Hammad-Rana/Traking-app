export const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // Fun way to format date
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    const formattedDate = date.toLocaleString('en-US', options);
  
    return `${formattedDate} `;
  };

  export const formalFormal = (dateString) => {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; 
  
    return `${month}-${day}-${year} ${hours}:${minutes} ${period}`;
  };