
export function stripHtmlTags(text) {
    if (!text) return "";
    return text.replace(/<[^>]*>/g, "");
  }
  
 
  export function extractLinks(text) {
    if (!text) return [];
    
    const linkRegex = /<a\s+href=["']([^"']*)["'][^>]*>(.*?)<\/a>/g;
    const links = [];
    let match;
  
    while ((match = linkRegex.exec(text)) !== null) {
      links.push({
        url: match[1],
        text: match[2].trim()
      });
    }
  
    return links;
  }
  
 
  export function processDescription(text) {
    if (!text) return { text: "", links: [] };
    
    const links = extractLinks(text);
    
   let processedText = text.replace(/<br\s*\/?>/gi, "\n");
    
    processedText = processedText.replace(/<[^>]*>/g, "");
    
    return {
      text: processedText,
      links: links
    };
  }