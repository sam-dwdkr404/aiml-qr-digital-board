# Resource Management System Guide

## How It Works

Your platform now has a **dynamic resource management system** that allows you to update study materials in real-time without redeploying.

### 1. Admin Panel Access
- **URL**: `/admin/resources`
- **Authentication**: Email-only login (no password required)
- **Storage**: All data saved to browser's localStorage (persists across sessions)

### 2. What You Can Manage

For each subject, you can add links to:
- **Module Notes** (up to 5 modules per subject)
- **Model Question Papers** (exam-style questions)
- **Previous Year Questions (PYQ)** (old exam papers)

### 3. Adding Resources

1. Go to `/admin/resources`
2. Enter your email and click "Login"
3. Select a subject (e.g., BIS613D)
4. Paste Google Drive or VTU links in the input fields
5. Click "Add" for each link
6. Click "Save All Changes"

### 4. Pre-Populated Example

**BIS613D (Cloud Computing & Security)** already has:
- Model Question Paper: `https://vtu.ac.in/pdf/QP/BIS613D.pdf`

This demonstrates how it works. You can add more or replace with Google Drive links.

### 5. How Students See It

When students visit `/subjects/[CODE]` (e.g., `/subjects/BIS613D`):
- Click **Notes** tab
- They'll see all your uploaded resources with download links
- Changes appear **instantly** after you save

### 6. Google Drive Links

To convert a Google Drive shareable link to a direct download:

**Original**: `https://drive.google.com/file/d/1a2b3c4d5e6f/view?usp=sharing`
**Download**: `https://drive.google.com/uc?export=download&id=1a2b3c4d5e6f`

## Current Setup

```
✅ BIS613D - Model Paper Link Already Added
❌ Module Notes (1-5) - Empty (add as needed)
❌ PYQs - Empty (add as needed)
❌ Other Subjects - All Empty (ready for your links)
```

## Available Subjects

- BCS602 - Machine Learning
- BIS613D - Cloud Computing and Security
- BCO601 - Microcontrollers and Embedded Systems
- BIKS609 - Indian Knowledge System
- BXX654x - Open Elective Course
- BPEK658 - Physical Education
- BCI685 - Project Phase-I
- BCSL606 - Machine Learning Lab
- BCSL657D - DevOps Lab
- Add-on - Add-on Course

## Timeline

You have **110 minutes** to collect more links. After that, provide them and I'll add them to BIS613D and other subjects.

## Notes

- Data saves only to this browser's localStorage
- If you clear browser data, resources will be deleted
- For production, we can move this to a backend database later
- Admin email is saved so you don't need to re-login each time
