// MuVeRA-Optimized Content Analysis for Screaming Frog
// Based on Google Research: Multi-Vector Retrieval as Fast as Single-Vector Search

// ⚠️ IMPORTANT: Replace with your actual Gemini API key
const GEMINI_API_KEY = 'xx-xx';

// MuVeRA-optimized configuration
const CONFIG = {
    TARGET_LENGTH: 150,    // Optimal for vector embeddings
    MIN_LENGTH: 50,        // Minimum semantic coherence
    MAX_LENGTH: 250,       // Maximum before complexity loss
    OVERLAP: 30,          // Context preservation
    TEXT_PREVIEW: 300,    // Gemini analysis preview
    VECTOR_DIMENSIONS: 768 // Standard embedding size
};

// Extract semantic passages optimized for vector retrieval
function extractSemanticPassages() {
    const clone = document.body.cloneNode(true);
    
    // Remove non-content elements
    clone.querySelectorAll('script, style, noscript, nav, header, footer, .ads, .sidebar').forEach(el => el.remove());
    
    // Target semantic content elements
    const elements = clone.querySelectorAll('p, li, td, th, blockquote, h1, h2, h3, h4, h5, h6, div[class*="content"], article, section');
    const textBlocks = [];
    
    elements.forEach(el => {
        const text = el.innerText || el.textContent || '';
        const cleaned = text.trim().replace(/\s+/g, ' ');
        
        if (cleaned.length > 30) {
            textBlocks.push({
                text: cleaned,
                isHeading: /^h[1-6]$/i.test(el.tagName),
                tag: el.tagName.toLowerCase(),
                semantic_weight: calculateSemanticWeight(el, cleaned)
            });
        }
    });
    
    return createOptimalPassages(textBlocks);
}

// Calculate semantic weight for MuVeRA optimization
function calculateSemanticWeight(element, text) {
    let weight = 1.0;
    
    // Element importance
    const tagWeights = {
        'h1': 3.0, 'h2': 2.5, 'h3': 2.0,
        'article': 2.5, 'section': 2.0,
        'p': 1.0, 'li': 0.8, 'div': 0.6
    };
    weight *= tagWeights[element.tagName.toLowerCase()] || 1.0;
    
    // Content quality indicators
    if (text.includes('?')) weight += 0.3; // Questions
    if (text.match(/\b(how|what|why|when|where|who)\b/i)) weight += 0.2; // Query intent
    if (text.length > 100 && text.length < 200) weight += 0.2; // Optimal length
    
    // Semantic richness
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/));
    const lexicalDiversity = uniqueWords.size / text.split(/\s+/).length;
    weight += lexicalDiversity * 0.5;
    
    return Math.round(weight * 100) / 100;
}

// Create passages optimized for multi-vector retrieval
function createOptimalPassages(textBlocks) {
    const passages = [];
    let buffer = [];
    let wordCount = 0;
    let currentSection = 'Main Content';
    let passageId = 0;
    let semanticWeight = 0;
    
    textBlocks.forEach((block, index) => {
        if (block.isHeading) {
            // Finalize current passage
            if (wordCount >= CONFIG.MIN_LENGTH) {
                passages.push(createPassageObject(buffer, wordCount, currentSection, passageId++, semanticWeight));
                buffer = [];
                wordCount = 0;
                semanticWeight = 0;
            }
            currentSection = block.text.substring(0, 50);
            return;
        }
        
        const words = block.text.split(/\s+/);
        
        // Handle long content blocks
        if (words.length > CONFIG.MAX_LENGTH) {
            if (wordCount >= CONFIG.MIN_LENGTH) {
                passages.push(createPassageObject(buffer, wordCount, currentSection, passageId++, semanticWeight));
                buffer = [];
                wordCount = 0;
                semanticWeight = 0;
            }
            
            // Smart sentence-based chunking
            const sentences = splitIntoSentences(block.text);
            let tempBuffer = [];
            let tempCount = 0;
            let tempWeight = 0;
            
            sentences.forEach(sentence => {
                const sentWords = sentence.trim().split(/\s+/);
                
                if (tempCount + sentWords.length > CONFIG.MAX_LENGTH && tempCount >= CONFIG.MIN_LENGTH) {
                    passages.push(createPassageObject(tempBuffer, tempCount, currentSection, passageId++, tempWeight));
                    // Maintain context overlap
                    tempBuffer = tempBuffer.slice(-CONFIG.OVERLAP).concat(sentWords);
                    tempCount = tempBuffer.length;
                    tempWeight = block.semantic_weight;
                } else {
                    tempBuffer = tempBuffer.concat(sentWords);
                    tempCount += sentWords.length;
                    tempWeight = Math.max(tempWeight, block.semantic_weight);
                }
            });
            
            if (tempCount >= CONFIG.MIN_LENGTH) {
                passages.push(createPassageObject(tempBuffer, tempCount, currentSection, passageId++, tempWeight));
            } else {
                buffer = tempBuffer;
                wordCount = tempCount;
                semanticWeight = tempWeight;
            }
        } else {
            // Normal passage building
            if (wordCount + words.length > CONFIG.MAX_LENGTH && wordCount >= CONFIG.MIN_LENGTH) {
                passages.push(createPassageObject(buffer, wordCount, currentSection, passageId++, semanticWeight));
                buffer = buffer.slice(-CONFIG.OVERLAP).concat(words);
                wordCount = buffer.length;
                semanticWeight = block.semantic_weight;
            } else {
                buffer = buffer.concat(words);
                wordCount += words.length;
                semanticWeight = Math.max(semanticWeight, block.semantic_weight);
                
                // Optimal passage completion
                if (wordCount >= CONFIG.TARGET_LENGTH && 
                    (index === textBlocks.length - 1 || textBlocks[index + 1].isHeading)) {
                    passages.push(createPassageObject(buffer, wordCount, currentSection, passageId++, semanticWeight));
                    buffer = [];
                    wordCount = 0;
                    semanticWeight = 0;
                }
            }
        }
    });
    
    // Handle remaining content
    if (wordCount >= CONFIG.MIN_LENGTH) {
        passages.push(createPassageObject(buffer, wordCount, currentSection, passageId++, semanticWeight));
    }
    
    return passages;
}

// Helper functions
function splitIntoSentences(text) {
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    return sentences.map(s => s.trim()).filter(s => s.length > 10);
}

function createPassageObject(words, count, section, id, weight) {
    const text = words.join(' ');
    return {
        id: `P${String(id).padStart(2, '0')}`,
        text: text,
        words: count,
        section: section,
        semantic_weight: weight,
        vector_quality: assessVectorQuality(text, count, weight),
        retrieval_score: calculateRetrievalScore(text, count)
    };
}

// Assess quality for vector embeddings (MuVeRA optimization)
function assessVectorQuality(text, wordCount, semanticWeight) {
    let score = 0;
    
    // Optimal length for vector embeddings
    const lengthOptimal = Math.max(0, 100 - Math.abs(wordCount - CONFIG.TARGET_LENGTH) * 2);
    score += lengthOptimal * 0.4;
    
    // Semantic coherence
    score += semanticWeight * 15;
    
    // Information density
    const sentences = splitIntoSentences(text);
    if (sentences.length > 1 && sentences.length < 6) score += 20;
    
    // Query-answering potential
    if (text.match(/\b(what|how|why|when|where|who)\b/i)) score += 15;
    if (text.includes('?')) score += 10;
    
    // Lexical diversity for better embeddings
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    const diversity = uniqueWords.size / words.length;
    score += diversity * 25;
    
    // Structural indicators
    if (text.match(/\b(first|second|third|finally|however|therefore|because)\b/i)) score += 10;
    
    return Math.min(100, Math.round(score));
}

// Calculate retrieval effectiveness score
function calculateRetrievalScore(text, wordCount) {
    let score = 0;
    
    // Length penalty for very short/long passages
    if (wordCount >= CONFIG.MIN_LENGTH && wordCount <= CONFIG.MAX_LENGTH) {
        score += 30;
    }
    
    // Content type scoring
    if (text.match(/\b(step|method|process|guide|tutorial)\b/i)) score += 20;
    if (text.match(/\b(example|instance|case|sample)\b/i)) score += 15;
    if (text.match(/\b(benefit|advantage|feature|solution)\b/i)) score += 15;
    
    // Question-answer format
    if (text.includes('?') && text.length > 100) score += 20;
    
    // List or enumeration
    if (text.match(/\b(include|such as|for example|namely)\b/i)) score += 10;
    
    return Math.min(100, score);
}

// Analyze with Gemini API (MuVeRA-focused)
function analyzeWithGemini(passages) {
    const passageData = passages.map(p => ({
        id: p.id,
        section: p.section,
        words: p.words,
        vector_quality: p.vector_quality,
        retrieval_score: p.retrieval_score,
        semantic_weight: p.semantic_weight,
        preview: p.text.substring(0, CONFIG.TEXT_PREVIEW) + (p.text.length > CONFIG.TEXT_PREVIEW ? '...' : '')
    }));
    
    const sectionGroups = {};
    passages.forEach(p => {
        if (!sectionGroups[p.section]) sectionGroups[p.section] = [];
        sectionGroups[p.section].push(p.id);
    });
    
    const prompt = `You are conducting a MuVeRA (Multi-Vector Retrieval Augmented) analysis inspired by Google Research. Focus on optimizing content for fast, accurate vector-based retrieval systems.

## WEBPAGE ANALYSIS
- URL: ${window.location.href}
- Title: ${document.title}
- Total Passages: ${passages.length}
- Vector Quality Avg: ${Math.round(passages.reduce((sum, p) => sum + p.vector_quality, 0) / passages.length)}
- Retrieval Score Avg: ${Math.round(passages.reduce((sum, p) => sum + p.retrieval_score, 0) / passages.length)}

## PASSAGE DATA (Vector-Optimized)
${JSON.stringify(passageData, null, 2)}

## SECTION MAPPING
${JSON.stringify(sectionGroups, null, 2)}

## MuVeRA ANALYSIS REQUIREMENTS

### 1. VECTOR EMBEDDING OPTIMIZATION
- Identify passages with vector_quality >80 (excellent for embeddings)
- Flag passages with vector_quality <60 (problematic for retrieval)
- Recommend optimal passage lengths and content density
- Suggest improvements for semantic coherence

### 2. MULTI-VECTOR RETRIEVAL STRATEGY
- Top 10 passages for primary vector index (highest retrieval potential)
- Secondary passages for context augmentation
- Passage clustering opportunities (related content grouping)
- Cross-reference mapping between related passages

### 3. CONTENT GAPS & OPPORTUNITIES
- Missing query-intent passages (what users actually search for)
- Underrepresented topics that should have dedicated passages
- Passages that need question-answer formatting
- Content that should be restructured for better retrieval

### 4. SEMANTIC STRUCTURE OPTIMIZATION
- Passage flow analysis for coherent retrieval chains
- Merge recommendations (specify exact passages and rationale)
- Split recommendations (identify break points and new focus areas)
- Hierarchical content organization improvements

### 5. FAST RETRIEVAL RECOMMENDATIONS
Following MuVeRA principles for speed:
- Passages to prioritize in primary index
- Content density optimizations
- Redundancy elimination strategies
- Preprocessing suggestions for faster embedding generation

### 6. ACTIONABLE IMPLEMENTATION PLAN
Provide 8 specific actions ranked by impact:
1. [HIGH IMPACT] Action on passages [IDs] - Why: [reason] - How: [specific steps]
2. [MEDIUM IMPACT] ...
(Continue for 8 total recommendations)

### 7. TECHNICAL METRICS
- Ideal passage count for this content volume
- Recommended vector dimension considerations
- Embedding overlap strategies
- Performance bottleneck identification

Focus on practical, implementable recommendations that directly improve multi-vector retrieval performance while maintaining content quality and user experience.`;
    
    try {
        const requestData = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 8192,
                topP: 0.8,
                topK: 40
            }
        };
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(requestData));
        
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.candidates && response.candidates[0]) {
                return response.candidates[0].content.parts[0].text;
            }
        }
        return `API Error: ${xhr.status} ${xhr.statusText}`;
    } catch (error) {
        return `Analysis Error: ${error.toString()}`;
    }
}

// Format comprehensive output
function formatMuVeRAOutput(passages, analysis) {
    const stats = {
        total: passages.length,
        avgWords: Math.round(passages.reduce((sum, p) => sum + p.words, 0) / passages.length),
        avgVectorQuality: Math.round(passages.reduce((sum, p) => sum + p.vector_quality, 0) / passages.length),
        avgRetrievalScore: Math.round(passages.reduce((sum, p) => sum + p.retrieval_score, 0) / passages.length),
        avgSemanticWeight: Math.round(passages.reduce((sum, p) => sum + p.semantic_weight, 0) / passages.length * 100) / 100,
        sections: [...new Set(passages.map(p => p.section))].length
    };
    
    const qualityTiers = {
        excellent: passages.filter(p => p.vector_quality >= 80),
        good: passages.filter(p => p.vector_quality >= 60 && p.vector_quality < 80),
        needsWork: passages.filter(p => p.vector_quality < 60)
    };
    
    const retrievalTiers = {
        high: passages.filter(p => p.retrieval_score >= 70),
        medium: passages.filter(p => p.retrieval_score >= 40 && p.retrieval_score < 70),
        low: passages.filter(p => p.retrieval_score < 40)
    };
    
    return {
        '🎯 MuVeRA Executive Summary': {
            'Analysis Date': new Date().toISOString(),
            'URL': window.location.href,
            'Vector Optimization Status': stats.avgVectorQuality >= 75 ? '✅ Excellent' : stats.avgVectorQuality >= 60 ? '⚠️ Good' : '❌ Needs Work',
            'Retrieval Readiness': stats.avgRetrievalScore >= 60 ? '✅ Ready' : '⚠️ Needs Optimization',
            'Total Passages': stats.total,
            'Sections': stats.sections,
            'Recommendation': stats.avgVectorQuality >= 70 && stats.avgRetrievalScore >= 60 ? 'Deploy to production' : 'Implement optimizations first'
        },
        
        '📊 Vector Quality Metrics': {
            'Average Vector Quality': `${stats.avgVectorQuality}/100`,
            'Average Retrieval Score': `${stats.avgRetrievalScore}/100`,
            'Average Semantic Weight': stats.avgSemanticWeight,
            'Optimal Length Ratio': `${Math.round(passages.filter(p => p.words >= CONFIG.MIN_LENGTH && p.words <= CONFIG.TARGET_LENGTH).length / passages.length * 100)}%`,
            'Quality Distribution': `Excellent: ${qualityTiers.excellent.length} | Good: ${qualityTiers.good.length} | Needs Work: ${qualityTiers.needsWork.length}`
        },
        
        '🚀 Retrieval Performance': {
            'High Retrieval Potential': retrievalTiers.high.map(p => `${p.id}(${p.retrieval_score})`).join(', ') || 'None',
            'Medium Retrieval Potential': retrievalTiers.medium.map(p => `${p.id}(${p.retrieval_score})`).join(', ') || 'None',
            'Low Retrieval Potential': retrievalTiers.low.map(p => `${p.id}(${p.retrieval_score})`).join(', ') || 'None',
            'Primary Index Candidates': passages.filter(p => p.vector_quality >= 80 && p.retrieval_score >= 70).map(p => p.id).join(', ') || 'None identified'
        },
        
        '📈 Passage Analytics': passages.reduce((acc, p) => {
            const sectionKey = `${p.section} (${passages.filter(x => x.section === p.section).length} passages)`;
            if (!acc[sectionKey]) acc[sectionKey] = [];
            acc[sectionKey].push(`${p.id}[${p.words}w|V${p.vector_quality}|R${p.retrieval_score}|S${p.semantic_weight}]`);
            return acc;
        }, {}),
        
        '🔍 MuVeRA Analysis': analysis,
        
        '⚡ Quick Implementation': {
            '1. Immediate Fixes': `Fix ${qualityTiers.needsWork.length} passages with Vector Quality <60: ${qualityTiers.needsWork.map(p => p.id).join(', ') || 'None'}`,
            '2. High-Impact Optimizations': `Optimize ${passages.filter(p => p.vector_quality >= 80 && p.retrieval_score >= 70).length} prime passages (V80+ R70+): ${passages.filter(p => p.vector_quality >= 80 && p.retrieval_score >= 70).map(p => p.id).join(', ') || 'None identified'}`,
            '3. Content Structure': 'Implement passage merging/splitting recommendations from MuVeRA Analysis',
            '4. Content Gaps': `Create missing query-intent content for ${stats.sections} sections`,
            '5. Vector Index Deployment': `Deploy ${qualityTiers.excellent.length + qualityTiers.good.length} optimized passages to vector index`,
            '6. Performance Monitoring': `Track retrieval performance across ${stats.total} passages and user engagement metrics`
        },
        
        '📄 Complete Passage Map': passages.map(p => 
            `${p.id}[${p.words}w] V:${p.vector_quality} R:${p.retrieval_score} S:${p.semantic_weight} "${p.text.substring(0, 60)}..."`
        ).join(' | ')
    };
}

// Main execution - following your working logic pattern
try {
    const passages = extractSemanticPassages();
    const analysis = analyzeWithGemini(passages);
    const output = formatMuVeRAOutput(passages, analysis);
    
    return seoSpider.data(output);
    
} catch (error) {
    return seoSpider.data({
        '❌ MuVeRA Analysis Error': {
            'Message': error.message,
            'Stack': error.stack?.substring(0, 500),
            'Timestamp': new Date().toISOString(),
            'Suggestion': 'Check API key and network connectivity'
        }
    });
}
