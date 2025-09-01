# Quick Setup Guide

## 1. Create Environment File

Create a file called `.env.local` in the root directory with your OpenAI API key:

```env
OPENAI_API_KEY=your_actual_api_key_here
```

## 2. Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env.local` file

## 3. Start the App

```bash
npm run dev
```

## 4. Test with Sample Content

Use the `sample-content.txt` file to test the app without uploading your own documents.

## 5. Upload Your Documents

- Currently supports `.txt` files
- PDF and Word support coming soon
- Drag and drop or click to browse

## Need Help?

- Check the README.md for detailed instructions
- Ensure your OpenAI API key is correct
- Make sure you have an active OpenAI account with credits
