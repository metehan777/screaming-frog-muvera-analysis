# MUVERA Content Analyzer for Screaming Frog

An experimental implementation of Google's Multi-Vector Retrieval via Fixed Dimensional Encodings (MuVeRA) research, adapted for SEO content optimization.

## 🚀 Overview

MUVERA Content Analyzer applies cutting-edge multi-vector retrieval concepts to analyze and optimize web content for AI-powered search systems. While Google's MUVERA wants to focus on making search faster, this tool uses the same principles to help content creators understand how their content performs in vector-based retrieval systems. MUVERA is not live or implemented fully on search systems, yet. 

## 🎯 What It Does

- **Splits content into optimal passages** (150-word targets) for vector embeddings
- **Analyzes each passage independently** with quality scores
- **Calculates retrieval potential** based on semantic richness
- **Identifies high-performing sections** for AI search systems
- **Provides actionable recommendations** for content optimization

## 📋 Prerequisites

- Screaming Frog SEO Spider (v16.0 or higher)
- Active Gemini API key
- Basic understanding of JavaScript extraction in Screaming Frog

## 🔧 Installation

1. **Get your Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Generate a new API key
   - Copy the key for use in step 3

2. **Open Screaming Frog**
   - Go to `Configuration > Custom > JavaScript`
   - Click "+" to add new JavaScript extraction

3. **Configure the extraction**
   - Name: `MUVERA Analysis`
   - Replace `YOUR_API_KEY_HERE` in the code with your actual Gemini API key:
   ```javascript
   const GEMINI_API_KEY = 'your-actual-api-key-here';
   ```

4. **Set extraction parameters**
   - Enabled: ✓
   - Extract: Text
   - Store: Yes

## 💻 Usage

1. **Start crawling** your target website in Screaming Frog
2. **Navigate** to the "JavaScript" tab after crawling completes
3. **Find** the "MUVERA Analysis" column
4. **Export** results for detailed analysis

## 📊 Understanding the Output

### Executive Summary
```
🎯 MuVeRA Executive Summary:
- Vector Optimization Status: ✅ Excellent / ⚠️ Good / ❌ Needs Work
- Retrieval Readiness: ✅ Ready / ⚠️ Needs Optimization
- Total Passages: Number of content segments analyzed
- Recommendation: Deploy/Optimize first
```

### Key Metrics

- **Vector Quality** (0-100): How well each passage would perform as an embedding
- **Retrieval Score** (0-100): Likelihood of passage being retrieved for relevant queries
- **Semantic Weight**: Importance based on content structure and quality

### Passage Map Format
```
P01[150w] V:85 R:72 S:2.5 "Beginning of passage text..."
```
- P01: Passage ID
- 150w: Word count
- V:85: Vector quality score
- R:72: Retrieval score
- S:2.5: Semantic weight

## 🧪 Experimental Nature

**Important**: This is an experimental adaptation of Google's research, not an official implementation. 

- We don't have access to Google's actual algorithms
- Configuration values are educated estimates
- Recommendations should be validated through real-world testing
- This tool provides insights, not guarantees

## ⚙️ Configuration

Default values optimized for general content:

```javascript
const CONFIG = {
    TARGET_LENGTH: 150,    // Optimal passage length
    MIN_LENGTH: 50,        // Minimum for coherence
    MAX_LENGTH: 250,       // Maximum before complexity
    OVERLAP: 30,          // Context preservation
    TEXT_PREVIEW: 300,    // Analysis preview length
    VECTOR_DIMENSIONS: 768 // Standard embedding size
};
```

Adjust based on your content type:
- **Technical docs**: Increase TARGET_LENGTH to 200-250
- **News articles**: Decrease to 100-125
- **E-commerce**: Decrease to 75-100

## 🔍 How MUVERA Works

1. **Passage Extraction**: Content is split into semantically coherent segments
2. **Quality Assessment**: Each passage is scored for vector embedding potential
3. **Retrieval Scoring**: Passages are evaluated for search retrieval likelihood
4. **Analysis**: Gemini AI provides strategic recommendations
5. **Output**: Comprehensive report with actionable insights

## 📈 Best Practices

1. **Regular Analysis**: Run MUVERA monthly to track content improvements
2. **Focus on Low Scores**: Prioritize passages with Vector Quality <60
3. **Test Changes**: Validate recommendations with real user data
4. **Iterate**: Content optimization is an ongoing process

## 🐛 Troubleshooting

### Common Issues

**"API Error: 403 Forbidden"**
- Check your API key is valid
- Ensure API is enabled in Google Cloud Console

**"No content found"**
- Verify JavaScript rendering is enabled in Screaming Frog
- Check if site uses heavy client-side rendering

**"Analysis timeout"**
- Site may have too much content per page
- Try crawling with reduced thread count

### Debug Mode

Add this to see raw passage data:
```javascript
console.log('Passages extracted:', passages.length);
console.log('First passage:', passages[0]);
```

## 🤝 Contributing

This is an experimental tool based on interpreting Google's research. Contributions welcome:

- Test on different content types
- Suggest configuration improvements
- Share performance metrics
- Report bugs or edge cases

## 📚 References

- [Google Research: MuVeRA Blog Post](https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/)
- [MuVeRA Paper (arXiv)](https://arxiv.org/abs/2405.19504)
- [ColBERT: Efficient and Effective Passage Search](https://arxiv.org/abs/2004.12832)

## ⚖️ Disclaimer

This tool is an independent interpretation of Google's MuVeRA research for SEO purposes. It is not affiliated with, endorsed by, or certified by Google. Use insights as guidance, not absolute truth.

## 📝 License

MIT License - See LICENSE file for details

---

**Built with curiosity about the future of search** 🚀
