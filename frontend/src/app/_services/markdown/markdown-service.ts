import { Injectable } from '@angular/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {

  constructor() { }

  async convertToHtml(markdown: string): Promise<string> {
    // Prima converto il markdown in HTML
    const htmlPromise = marked(markdown);
    const htmlContent = await htmlPromise;
    // Poi sanitizza l'HTML risultante
    return this.sanitizeMarkdown(htmlContent);
  }

  sanitizeMarkdown(html: string): string {
    // Sanitizza l'output HTML per prevenire attacchi XSS
    return DOMPurify.sanitize(html, {
      FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'object', 'embed', 'applet'],
      FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onmouseout', 'onfocus', 'onblur', 'formaction']
    });
  }

}
