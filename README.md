# **ArcForge**

---

## **Prerequisites**

### **General Requirements**
- [Node.js](https://nodejs.org) (LTS version recommended)
- [Git](https://git-scm.com/)

### **Optional (but Recommended)**
- [pnpm](https://pnpm.io/)

---

## **Dashboard Setup**

### **1. Clone the Repository**
```bash
git clone https://github.com/amgvu/ArcForge.git
cd arcforge
```

### **2. Install Dependencies**
Run the following command to install all necessary packages:
```bash
npm install
```
_If using `yarn` or `pnpm`, replace `npm install` with:_
```bash
yarn install
# OR
pnpm install
```

### **3. Run the Development Server**
Start the Next.js development server:
```bash
npm run dev
```
- Open `http://localhost:3000/dashboard`

### **4. Supabase Integration**
Set up environment variables for Supabase:
1. Create a `.env.local` file in the root directory.
2. Add the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=##############
   NEXT_PUBLIC_SUPABASE_ANON_KEY=################
   ```
3. Save the file.

### **5. Access the Dashboard**
Once the server is running, you can start interacting with the dashboard.

---

## **Recommended VS Code Extensions**

### **For Dashboard Development**
- Tailwind CSS IntelliSense
- Supabase VS Code Extension
- ESLint for consistent formatting

---

## **Contributing**

Feel free to create GitHub issues for features, bug fixes, or documentation updates

