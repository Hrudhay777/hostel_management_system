Centurion logo usage
=====================

Place the university emblem image at `public/images/centurion-logo.png`.

Recommendations:
- Use a square PNG with transparent background.
- Crop or trim the image so the circular emblem sits in the top portion of the file (the app CSS will crop the visible area to a 40×40 circle). If the original image contains text below the emblem, keep the emblem near the top so the letters are hidden by the layout's crop.
- Recommended size: 200×200 px (the app will scale to 40×40 in the navbar).

If you'd like me to add/replace the file with the attachment you uploaded, confirm and I'll write it to `public/images/centurion-logo.png` and rebuild the app.
# Image Upload Guide

This directory structure has been set up for you to add images to the Hostel Management System.

## Directory Structure

```
public/images/
├── hostel/              # Hostel building and facility photos
│   ├── main_building.jpg
│   ├── boys_hostel.jpg
│   ├── girls_hostel.jpg
│   └── campus_view.jpg
├── rooms/              # Individual room photos
│   ├── 101.jpg
│   ├── 102.jpg
│   └── ...
├── students/           # Student profile pictures
│   ├── std-001.jpg
│   ├── std-002.jpg
│   └── ...
└── facilities/         # Common facilities photos
    ├── dining_hall.jpg
    ├── study_hall.jpg
    ├── recreation.jpg
    └── laundry.jpg
```

## How to Add Images

### 1. Hostel Building Images
- Place hostel and facility photos in `public/images/hostel/`
- Recommended size: 1200x800px
- Formats: JPG, PNG

### 2. Room Photos
- Place room photos in `public/images/rooms/`
- Name them after room numbers (e.g., `101.jpg`, `102.jpg`)
- Recommended size: 800x600px

### 3. Student Profile Pictures
- Place student photos in `public/images/students/`
- Name them after student IDs (e.g., `std-001.jpg`)
- Recommended size: 400x400px
- Formats: JPG, PNG with transparent background recommended

### 4. Facility Images
- Place common area photos in `public/images/facilities/`
- Includes: dining hall, study hall, recreation area, laundry room
- Recommended size: 1000x600px

## Usage in Components

### In Templates
```html
<img src="/images/hostel/boys_hostel.jpg" alt="Boys Hostel" />
<img src="/images/rooms/{{ room.roomNumber }}.jpg" alt="Room {{ room.roomNumber }}" />
<img src="/images/students/{{ student.id }}.jpg" alt="{{ student.name }}" />
```

### In TypeScript
```typescript
// Set image path for hostel block
block.image = '/images/hostel/boys_hostel.jpg';

// Set image path for room
room.image = `/images/rooms/${room.roomNumber}.jpg`;

// Set image path for student
student.avatar = `/images/students/${student.id}.jpg`;
```

## Image Optimization Tips

1. **Compress images** before uploading to reduce file size
2. **Use appropriate formats**: 
   - JPG for photos
   - PNG for images with transparency
   - WebP for better compression
3. **Responsive images**: Provide multiple sizes for different devices
4. **Lazy loading**: Images will auto-load as needed

## University Information

**Centurion University of Technology and Management**
- Location: Vizianagaram, Andhra Pradesh
- Website: www.cutm.ac.in

## File Upload Instructions

Once you have images ready:
1. Create folders as shown in the structure above
2. Add images to respective folders
3. Update model references with image paths
4. Test in the application

The application will automatically display images when they are found at the specified paths.
