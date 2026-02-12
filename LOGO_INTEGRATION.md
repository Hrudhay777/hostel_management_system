# Centurion University Logo - Integration Guide

## 📍 How to Add the Logo

The logo you provided will be displayed in the navbar. Here's how to integrate it:

### Option 1: Using Emoji (Current Setup)
The current navbar uses `🏢` emoji. To replace with the Centurion University logo:

**Location:** `src/app/components/layout/layout.component.ts`

### Option 2: Using Image File (Recommended)

1. **Save the logo image:**
   - Place the Centurion University logo in: `public/images/centurion-logo.png`
   - Recommended size: 40x40px
   - Format: PNG with transparent background

2. **Update the LayoutComponent:**

In the template, replace this line:
```html
<span class="logo-icon">🏢</span>
```

With:
```html
<img src="/images/centurion-logo.png" alt="Centurion University" class="logo-icon-img">
```

3. **Add CSS styling** (in the styles section):
```css
.logo-icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
```

### Steps to Implement:

1. **Save your logo image** as `centurion-logo.png` in `public/images/`

2. **Edit the layout component file:**
   - Open: `src/app/components/layout/layout.component.ts`
   - Find the line with `<span class="logo-icon">🏢</span>`
   - Replace with: `<img src="/images/centurion-logo.png" alt="Centurion University" class="logo-icon-img">`

3. **Add CSS styling:**
   - Find the `.logo-icon` CSS section
   - Add new styling:
   ```css
   .logo-icon-img {
     width: 40px;
     height: 40px;
     margin-right: 0.5rem;
     object-fit: contain;
   }
   ```

4. **Test in browser:**
   - The logo should appear in the navbar next to "Boys Hostel"

### Complete Navbar Structure:
```
[Centurion Logo] Boys Hostel | Dashboard | Hostel Office | Rooms | ... [RK]
```

### Logo Requirements:
- **Size:** Preferably 40x40px or square aspect ratio
- **Format:** PNG, JPG, or WebP
- **Background:** Transparent (PNG recommended)
- **Color:** Full color or white/single color (will show against purple navbar)

### Current Status:
✅ Navbar title changed to "Boys Hostel"  
✅ Logo placeholder ready (using emoji)  
⏳ Waiting for logo image to be added  

Once you upload the logo image to `public/images/centurion-logo.png`, the navbar will display it alongside "Boys Hostel".

---

**Note:** The logo image you provided shows the official Centurion University seal with the motto "CENTURION THROUGH KNOWLEDGE". This professional logo will enhance the system's appearance and institutional branding.
