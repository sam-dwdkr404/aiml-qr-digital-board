# 📄 PDF Papers and Assignments

This folder contains all CIE papers and assignment PDFs for the Digital Class Board.

## File Structure

```
/pdfs/
├── CIE1_QuestionPaper.pdf
├── CIE1_Solution.pdf
├── CIE2_QuestionPaper.pdf
├── CIE2_Solution.pdf
├── Assignment1_NeuralNetworks.pdf
├── Assignment2_CloudSecurity.pdf
├── Assignment3_Microcontroller.pdf
├── Assignment4_IKS.pdf
└── Assignment5_Elective.pdf
```

## How to Add PDFs

1. **Save your PDF files** to this folder with the exact names listed above
2. **Update the data.ts file** if you need to change file names or add new papers/assignments
3. **Set availability** in `data.ts` by changing the `available` property:
   - `available: true` - PDF shows as downloadable
   - `available: false` - PDF shows as "Not uploaded yet"

## CIE Papers

### CIE 1 (Available)
- CIE1_QuestionPaper.pdf - Question paper with questions
- CIE1_Solution.pdf - Solution key and marking scheme

### CIE 2 (Not Yet Uploaded)
- CIE2_QuestionPaper.pdf - (To be added)
- CIE2_Solution.pdf - (To be added)

## Assignments

| File | Subject | Due Date |
|------|---------|----------|
| Assignment1_NeuralNetworks.pdf | Machine Learning (BCS602) | Feb 10, 2026 |
| Assignment2_CloudSecurity.pdf | Cloud Computing (BIS613D) | Feb 12, 2026 |
| Assignment3_Microcontroller.pdf | Microcontrollers (BCO601) | Feb 15, 2026 |
| Assignment4_IKS.pdf | Indian Knowledge System (BIKS609) | Feb 18, 2026 |
| Assignment5_Elective.pdf | Open Elective (BXX654x) | Feb 20, 2026 |

## Instructions

### To Add a New CIE Paper:

1. Add PDF file to this folder
2. Open `frontend/app/lib/data.ts`
3. Find the `ciePapers` array
4. Add new entry:
```typescript
{
  id: 3,
  name: "CIE 3",
  papers: [
    { id: "cie3-qp", name: "Question Paper", url: "/pdfs/CIE3_QuestionPaper.pdf", available: true },
    { id: "cie3-sol", name: "Solution", url: "/pdfs/CIE3_Solution.pdf", available: true }
  ]
}
```

### To Add a New Assignment:

1. Add PDF file to this folder
2. Open `frontend/app/lib/data.ts`
3. Find the `assignmentsList` array
4. Add new entry:
```typescript
{
  id: 6,
  title: "Your Assignment Title",
  subject: "BCS602",
  subjectName: "Machine Learning",
  description: "Assignment description here",
  dueDate: "2026-02-25",
  url: "/pdfs/Assignment6_YourFile.pdf",
  faculty: "Dr. Preeti Savant"
}
```

### To Mark as Not Available:

In the CIE papers or assignments data, change `available: true` to `available: false`.

The UI will automatically:
- Disable the download button
- Show "Not uploaded yet" message
- Gray out the button with 50% opacity

## Features

✅ **Auto-dated assignments** - Shows "Due Today", countdown days, or "Overdue" status  
✅ **Color coded status** - Green (Normal), Orange (2 days or less), Red (Overdue)  
✅ **Faculty information** - Each assignment shows the faculty name  
✅ **Easy management** - Simple data structure for quick updates  
✅ **Responsive design** - Works on mobile, tablet, and desktop  

## Testing Locally

1. Place PDF files in this folder
2. Update `data.ts` with correct filenames
3. Refresh the browser
4. Click "📝 CIE Papers" or "✅ Assignments" cards to view

The modals will automatically display your PDFs with download links!

---

**Note:** Make sure PDF file names match exactly what's in `data.ts` (case-sensitive on Linux/Mac).
