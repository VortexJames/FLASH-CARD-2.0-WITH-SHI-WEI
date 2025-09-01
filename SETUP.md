# Quick Setup Guide

## 1. Create Environment File

Create a file called `.env.local` in the root directory with your OpenRouter API key:

```env
OPENROUTER_API_KEY=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
```

## 2. Your OpenRouter API Key

Your API key is already provided:
- **API Key**: `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`
- **Model**: GPT-3.5-turbo (gpt-3.5-turbo)
- **Provider**: OpenRouter

## 3. Start the App

```bash
npm run dev
```

## 4. Test with Sample Content

Use the `sample-content.txt` file to test the app without uploading your own documents.

## 5. Upload Your Documents

- Supports `.txt`, `.pdf`, `.doc`, and `.docx` files
- Automatic text extraction from all formats
- Drag and drop or click to browse

## Need Help?

- Check the README.md for detailed instructions
- Ensure your OpenAI API key is correct
- Make sure you have an active OpenAI account with credits
