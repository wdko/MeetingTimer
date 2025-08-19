# Meeting Topic Timer

Meeting Topic Timer is a static web application built with HTML5, CSS, and JavaScript that allows users to create and manage multiple timers for meeting topics. The application supports shareable URLs, dark theme, and runs entirely in the browser without requiring any backend.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap and Run the Application
- **No build process required** - This is a static web application that requires only a web server
- Start a local HTTP server using one of these methods:
  - **Python (recommended)**: `python3 -m http.server 8080` - Takes 1-2 seconds to start. NEVER CANCEL.
  - **Python (alternative)**: `python -m http.server 8080` - Takes 1-2 seconds to start. NEVER CANCEL.
  - **PHP**: `php -S localhost:8080` - Takes 1-2 seconds to start. NEVER CANCEL.
- Access the application at `http://localhost:8080` in your browser
- **CRITICAL**: Always use a local web server - opening `index.html` directly in browser will not work due to CORS restrictions with URL sharing functionality

### Running the Application
- Start the server from the repository root directory
- The application loads immediately (under 1 second) once the server is running
- No dependencies to install, no build steps required
- Application works in all modern browsers

### Core Application Features Validation
After starting the server, always validate these core features work:
1. **Add Timer**: Click "Add Topic Timer" - creates a new timer with default 5-minute duration
2. **Edit Timer**: 
   - Type in the topic text field to set timer name
   - Change the number input to set timer duration in minutes
3. **Start Timer**: Click "Start" button - timer counts down, Start button becomes disabled
4. **Share URL**: The URL in the share input updates automatically and can be used to recreate the timer setup
5. **Dark Theme**: Click "Toggle Dark Theme" - switches between light and dark themes
6. **Remove Timer**: Click "Remove" button to delete a timer

## Validation Scenarios

### MANDATORY: Complete End-to-End Testing
Always perform these validation steps after making any changes:

1. **Timer Creation and Operation Test**:
   ```bash
   # Start server
   python3 -m http.server 8080
   # Open http://localhost:8080 in browser
   # Add a timer with topic "Test Meeting"
   # Set duration to 2 minutes  
   # Click Start and verify countdown begins
   # Verify Start button becomes disabled during countdown
   ```

2. **Share URL Functionality Test**:
   ```bash
   # Create 2-3 timers with different topics and durations
   # Copy the generated share URL from the input field
   # Open the share URL in a new browser tab
   # Verify all timers are recreated with correct topics and durations
   ```

3. **Dark Theme Test**:
   ```bash
   # Click "Toggle Dark Theme" button
   # Verify UI switches to dark color scheme
   # Verify all text remains readable
   # Toggle back to light theme and verify normal appearance
   ```

### Expected Behavior and Known Issues
- **JavaScript Error**: There is a known JavaScript error in the console: `TypeError: Cannot set properties of null (setting 'onclick') at app.js:174`. This error does NOT affect functionality - the application works correctly despite this error.
- **Timer Sound**: Timers are supposed to play a sound when they complete (per Requirements.txt), but this feature may not be fully implemented
- **Navigation Buttons**: The code references prev/next timer navigation that may not be fully implemented in the UI

## Repository Structure

### Key Files
- `index.html` - Main application HTML structure
- `app.js` - Application JavaScript logic (timers, URL sharing, theme toggle)
- `style.css` - Application styles including dark theme
- `Requirements.txt` - Project requirements and feature specifications
- `.vscode/tasks.json` - VS Code task configuration for starting Python server

### File Locations
```
/
├── index.html          # Main application entry point
├── app.js             # Core application logic
├── style.css          # Styling and dark theme
├── Requirements.txt   # Project specifications
└── .vscode/
    └── tasks.json     # VS Code server task
```

## Common Tasks

### Server Commands (Choose One)
```bash
# Python 3 (recommended)
python3 -m http.server 8080

# Python (alternative)  
python -m http.server 8080

# PHP (alternative)
php -S localhost:8080
```

### Repository Directory Structure
```
/home/runner/work/MeetingTimer/MeetingTimer/
├── .git/               # Git repository data
├── .github/            # GitHub configuration
│   └── copilot-instructions.md
├── .vscode/            # VS Code configuration
│   └── tasks.json      # Pre-configured server task
├── Requirements.txt    # Project requirements and features
├── app.js             # Main application JavaScript (8452 bytes)
├── index.html         # Application HTML structure (768 bytes)
└── style.css          # CSS styles and dark theme (3363 bytes)
```

### Quick Reference Commands
```bash
# Repository status
ls -la
# .git .github .vscode Requirements.txt app.js index.html style.css

# View project requirements
cat Requirements.txt

# Start server (any of these work)
python3 -m http.server 8080
python -m http.server 8080  
php -S localhost:8080
```

### File Editing Workflow
1. **Edit HTML/CSS/JavaScript files directly** - no compilation needed
2. **Refresh browser** to see changes immediately  
3. **Test functionality** using the validation scenarios above
4. **No linting tools configured** - manual code review required
5. **No test suite** - rely on manual validation scenarios

### Development Process
- Make changes to `.html`, `.js`, or `.css` files
- Refresh browser to see changes (no build step)
- Always test core functionality after changes
- Use browser developer tools for debugging JavaScript issues
- Validate share URL functionality after any JavaScript changes

## Available Tools and Environment

### Pre-installed Software
- **Python 3.12.3** - Available as both `python` and `python3`
- **Node.js v20.19.4** - Available but not required for this project
- **PHP 8.3.6** - Available as alternative server option
- **Apache/Nginx** - Available but overkill for this simple static site

### Browser Testing
- Use browser developer tools for debugging
- Test in multiple browsers if making significant changes
- Validate responsive design on different screen sizes (application includes mobile CSS)

### VS Code Integration
- Use the pre-configured task: **Terminal → Run Task → "Start Static Server"**
- This runs `python -m http.server 8080` automatically

## Troubleshooting

### Common Issues
1. **Application not loading**: Ensure you're accessing via HTTP server, not opening file directly
2. **Share URLs not working**: Verify you're testing with actual server URLs, not file:// URLs
3. **JavaScript console errors**: The known error on line 174 is expected and doesn't break functionality
4. **Timer not starting**: Check browser console for JavaScript errors; ensure timer duration is set to valid number

### Debug Steps
1. **Check server is running**: Verify you can access `http://localhost:8080`
2. **Open browser developer tools**: Check Console tab for JavaScript errors
3. **Verify file changes**: Hard refresh browser (Ctrl+F5) to bypass cache
4. **Test in private/incognito browser window**: Eliminates cache and extension issues

## Time Expectations
- **Server startup**: 1-2 seconds - NEVER CANCEL
- **Application load**: Under 1 second
- **Feature testing**: 2-3 minutes for complete validation
- **File editing and refresh**: Immediate (no build process)

All commands complete quickly. The only "long-running" process is the HTTP server which runs indefinitely until stopped with Ctrl+C.