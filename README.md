# FlashCard AI - Exam Revision Made Easy

An AI-powered flash card application that transforms your study documents into interactive, intelligent flash cards for exam preparation.

## ✨ Features

- **Document Upload**: Support for text files (.txt) with PDF and Word support coming soon
- **AI-Powered Generation**: Uses OpenAI's GPT models to create relevant, educational questions
- **Smart Question Types**: Multiple choice, true/false, and fill-in-the-blank questions
- **Difficulty Levels**: Easy, medium, and hard questions based on your content
- **Interactive Study**: Beautiful, animated flash card interface with progress tracking
- **Study Analytics**: Track your performance and review progress
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- OpenAI API key (get one from [OpenAI Platform](https://platform.openai.com/api-keys))

### Installation

1. **Clone or download the project**
   ```bash
   cd flash-card-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### 1. Upload Documents
- Drag and drop your text files or click to browse
- Currently supports `.txt` files
- PDF and Word document support coming soon

### 2. Configure Generation Settings
- Choose the number of questions (5-25)
- Select difficulty level (Easy, Medium, Hard)
- Pick question types (Multiple Choice, True/False, Fill-in-Blank)

### 3. Generate Flash Cards
- Click "Generate Flash Cards"
- AI will analyze your content and create relevant questions
- Wait for processing to complete

### 4. Study & Practice
- Navigate through your flash cards
- Click to reveal answers
- Rate your knowledge (Correct/Incorrect)
- Track your progress and performance

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Notifications**: React Hot Toast

## 🔧 Configuration

### OpenAI API Settings

The app uses OpenAI's GPT-3.5-turbo model by default. You can customize:

- **Model**: Change `OPENAI_MODEL` in your environment variables
- **Temperature**: Adjust creativity vs consistency (currently set to 0.7)
- **Max Tokens**: Control response length (currently set to 2000)

### Question Generation

The AI is configured to generate:
- Clear, unambiguous questions
- Difficulty-appropriate content
- Varied question types
- Educational explanations

## 📁 Project Structure

```
flash-card-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── DocumentUpload.tsx # File upload component
│   ├── FlashCard.tsx      # Individual flash card
│   └── FlashCardDeck.tsx  # Flash card deck manager
├── types/                  # TypeScript type definitions
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md              # This file
```

## 🚧 Future Enhancements

- [ ] PDF document support
- [ ] Word document (.doc, .docx) support
- [ ] Spaced repetition algorithm
- [ ] Export flash cards to various formats
- [ ] Collaborative study sessions
- [ ] Custom question templates
- [ ] Advanced analytics and insights
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Important Notes

- **API Costs**: Using OpenAI's API incurs costs based on usage. Monitor your API usage in the OpenAI dashboard.
- **Content Privacy**: Your documents are processed by OpenAI's servers. Avoid uploading sensitive or confidential information.
- **Rate Limits**: Be mindful of OpenAI's rate limits for API calls.

## 🆘 Support

If you encounter any issues:

1. Check that your OpenAI API key is correctly set
2. Ensure your documents are in supported formats
3. Verify your internet connection
4. Check the browser console for error messages

## 🎯 Use Cases

- **Student Exam Preparation**: Convert lecture notes into practice questions
- **Professional Certification**: Study for industry certifications and exams
- **Language Learning**: Create vocabulary and grammar practice cards
- **Training Materials**: Transform company training documents into interactive content
- **Research Review**: Convert research papers into comprehension questions

---

Built with ❤️ using Next.js and OpenAI
