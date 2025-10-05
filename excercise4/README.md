# Exercise 4.1 - SVG House and Garden Scene

**Student:** Dong Nguyen Gia Huy - 104993450  
**Unit:** COS30045 - Data Visualization  
**Exercise:** 4.1 - SVG Foundation for D3.js

## Overview

This exercise demonstrates the fundamental SVG elements and concepts that form the foundation for D3.js data visualization. The project creates a house and garden scene using various SVG shapes, paths, groups, and text elements.

## SVG Elements Demonstrated

### Basic Shapes
- **Rectangle (`<rect>`)**: Sky, grass, house body, door, tree trunk, windows
- **Circle (`<circle>`)**: Sun, door knob, decorative bushes
- **Ellipse (`<ellipse>`)**: Tree leaves with different x and y radii
- **Polygon (`<polygon>`)**: House roof (triangular shape)
- **Line (`<line>`)**: Property boundary with dashed stroke pattern

### Advanced Elements
- **Path (`<path>`)**: Curved garden walkway using quadratic Bézier curves
- **Text (`<text>`)**: Scene title and coordinate reference labels
- **Group (`<g>`)**: Windows grouped together with transform translation

## Technical Features

### Coordinate System
- **ViewBox**: `0 0 900 520` for responsive scaling
- **Clean coordinates**: Logical positioning system
- **Responsive design**: Scales appropriately across devices

### Styling Approach
- **CSS Classes**: Maintainable and reusable styling
- **PowerHub Theme**: Consistent with existing project palette
- **Hover Effects**: Interactive visual feedback
- **Accessibility**: Proper ARIA labels and focus indicators

### Transforms and Paths
- **Group Transformation**: `translate()` for window positioning
- **Bézier Curves**: Smooth, organic curved walkway
- **Layered Composition**: Logical z-index from background to foreground

## File Structure

```
excercise4_1/
├── excercise4_1.html    # Main HTML file with inline SVG
├── css/
│   └── style.css        # Styling with PowerHub theme
└── README.md           # This documentation
```

## Learning Objectives

This exercise covers the essential SVG concepts needed for D3.js:

1. **Shape Creation**: Understanding basic SVG shape elements
2. **Coordinate Systems**: Working with viewBox and positioning
3. **Styling**: CSS integration with SVG elements
4. **Grouping**: Using `<g>` elements for logical organization  
5. **Paths**: Creating complex shapes with path data
6. **Text Integration**: Adding labels and annotations
7. **Accessibility**: Proper ARIA implementation for SVG

## Next Steps

This foundation prepares for:
- D3.js data binding to SVG elements
- Dynamic shape creation and manipulation
- Interactive data visualizations
- Advanced path animations and transitions

## Browser Compatibility

- Modern browsers with SVG support
- Responsive across desktop and mobile devices
- Accessibility compliant (WCAG 2.1)

## Development Notes

Built using:
- HTML5 semantic structure
- CSS3 with custom properties
- SVG 1.1 specification
- PowerHub design system integration