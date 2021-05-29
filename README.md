
# Time Slot Picker - jQuery Plugin

This will add a beautiful embedded time picker to your website. 


## Installation 

Install time-slot-picker with npm

```bash 
  npm i @randika-srimal/time-slot-picker
```
    
## Usage/Examples

```html
<div id="time-slot-picker"></div>
```
```javascript
$('#time-slot-picker').timeSlotPicker(
    {
        startTime:'00:00',
        endTime:'24:00',
        timeStep:'15',
        defaultDate:'2021-05-32',
        maxDateTime:'2021-06-01 13:15',
        minDateTime:'2021-05-28 10:15',
        minDayTime:'09:00',
        maxDayTime:'18:00',
        inputElementSelector:'#early-delivery-time'
    }
);
```
These passing options are all optional.
  
## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

  
## License

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/)

  
## Support

For support, email email2randika@gmail.com.

  