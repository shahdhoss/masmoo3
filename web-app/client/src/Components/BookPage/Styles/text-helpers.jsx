export function stripHtmlTags(text) {
  if (!text) return ""
  return text.replace(/<[^>]*>/g, "")
}

export function extractLinks(text) {
  if (!text) return []

  const linkRegex = /<a\s+href=["']([^"']*)["'][^>]*>(.*?)<\/a>/g
  const links = []
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    links.push({
      url: match[1],
      text: match[2].trim(),
    })
  }

  return links
}

export function processDescription(text) {
  if (!text) return { text: "", links: [] }

  // Replace <br> tags with newlines
  let processedText = text.replace(/<br\s*\/?>/gi, "\n")
  
  // First extract all links to process them
  const links = extractLinks(processedText)
  
  // Remove "Get" from the beginning of link text and surrounding text
  processedText = processedText.replace(/Get\s+<a\s+href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, function(match, url, linkText) {
    return `<a href="${url}">${linkText}</a>`
  })
  
  // Now remove all links completely
  processedText = processedText.replace(/<a\s+href=["'][^"']*["'][^>]*>.*?<\/a>/g, "")
  
  // Remove any remaining HTML tags
  processedText = processedText.replace(/<[^>]*>/g, "")
  
  // Remove any "Get" followed by "here" (case insensitive)
  processedText = processedText.replace(/Get\s+here\./gi, "here.")
  processedText = processedText.replace(/here\./gi,"")

  
  // Return only the processed text without links section
  return {
    text: processedText,
    links: [], // Return empty array since we don't want to show links section
  }
}
