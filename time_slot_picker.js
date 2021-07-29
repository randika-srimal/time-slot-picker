(function ( $ ) {
    $.fn.timeSlotPicker = function(options) {

        var settings = $.extend({
            startTime:'00:00',
            endTime:'24:00',
            timeStep:'15',
            minDateTime:null,
            maxDateTime:null,
            minDayTime:null,
            maxDayTime:null,
            skipWeekends:false,
            defaultDate:convertDateObjectToFormat(new Date(),'YYYY-MM-DD'),
            inputElementSelector:null
        }, options );

        var appendToElement = this;
        var days = 0;

        function convertDateObjectToFormat(dateObject, formatString){

            var year = dateObject.getFullYear();
            var month = dateObject.getMonth()+1;
            var date = dateObject.getDate();
            var hours = dateObject.getHours();
            var minutes = dateObject.getMinutes();
            var value = dateObject;

            if(formatString == "YYYY-MM-DD H:i:s"){
                value = year+"-"+(month<10?"0"+month:month)
                +"-"+(date<10?"0"+date:date)
                +" "+(hours<10?"0"+hours:hours)
                +":"+(minutes<10?"0"+minutes:minutes)
                +":00";
            }else if(formatString == 'YYYY-MM-DD'){
                value = year+"-"+(month<10?"0"+month:month)
                +"-"+(date<10?"0"+date:date);
            }

            return value;
        }

        function hhmm24HourTimeToMinutes(timeString){
            var splitedToHHMM = timeString.split(":");
            return (parseInt(splitedToHHMM[0])*60) + parseInt(splitedToHHMM[1]);
        }

        function formatTime(h,m){
            var timeString;

            if(h<12){
                timeString = (h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+" am";
            }else if(h==12){
                timeString = (h<10?"0"+h:h)+":"+(m<10?"0"+m:m)+" pm";
            }else{
                var h1 = h-12;
                timeString = (h1<10?"0"+h1:h1)+":"+(m<10?"0"+m:m)+" pm";
            }

            return timeString;
        }

        function rendertimeSlotPicker(selectedDate){
            var titleDateString = selectedDate.toDateString();
            selectedDate.setHours(0);
            selectedDate.setMinutes(0);

            var selectedDateInMinutes = ((selectedDate.getTime()/1000)/60);

            var timeStep = parseInt(settings['timeStep']);
            var slotCounter = 0
            var slotRow = [];
            var slots = [];

            for (let index = startTimeInMins; index <= endTimeInMins;) {
                var h1 = Math.floor(index/60);
                var m1 = index%60;

                var slotObject = {
                    hours:h1,
                    minutes:m1,
                    disable:false,
                };

                if(maxDayTimeInMins && (maxDayTimeInMins < index)){
                    slotObject['disable'] = true;
                }

                if(minDayTimeInMins && (minDayTimeInMins > index)){
                    slotObject['disable'] = true;
                }

                if(maxDateTimeInMins && ((selectedDateInMinutes+index)>maxDateTimeInMins)){
                    slotObject['disable'] = true;
                }

                if(minDateTimeInMins && ((selectedDateInMinutes+index)<minDateTimeInMins)){
                    slotObject['disable'] = true;
                }

                slotRow.push(slotObject);
                slotCounter++;
                
                if(slotCounter == 4 || index == endTimeInMins){
                    slotCounter = 0;
                    slots.push(slotRow);
                    slotRow=[];
                }

                index+=timeStep;
            }

            var element  = '<table class="time-slot-picker-table" style="width: 100%;">';
                element += '<thead style="background-color:#103C6D;color:#ffffff;">';
                element += '<tr>';
                element += '<th class="tsp-prev-btn-wrapper" style="padding: 10px 0px 10px 0px;cursor:pointer;"><</th>';
                element += '<th class="title" colspan="2" style="padding: 10px 0px 10px 0px;"></th>';
                element += '<th class="tsp-next-btn-wrapper" style="padding: 10px 0px 10px 0px;cursor:pointer;">></th>';
                element += '</tr>';
                element += '</thead>';
                element += '<tbody>';

                slots.forEach(row => {
                    element+='<tr style="border-bottom:1px solid #D3D3D3;">';

                    row.forEach(slot => {
                        element+='<td style="text-align: center;padding: 10px 0px 10px 0px;">';

                        if(slot['disable']){
                            element+='<div class="tsp-time-wrapper tsp-time-slot-disabled" style="color:#D3D3D3;cursor: not-allowed;width:fit-content;margin:auto;padding:5px;border-radius:15px;">'+formatTime(slot['hours'],slot['minutes'])+'</div>';
                        }else{
                            element+='<div class="tsp-time-wrapper" style="color:#4A4B4E;cursor:pointer;width:fit-content;margin:auto;padding:5px;border-radius:15px;">'+formatTime(slot['hours'],slot['minutes'])+'</div>';
                        }

                        element+='</td>';
                    });

                    element+='</tr>';
                });
                element += '</tbody>';
                element += '</table>';
                appendToElement.html(element);

            $('.time-slot-picker-table .title').text(titleDateString);

            setInputValue();

            if(maxDateObj && (maxDateObj.toDateString() == selectedDate.toDateString())){
                $('.time-slot-picker-table .tsp-next-btn-wrapper')
                .css({'cursor':'not-allowed','color':'#D3D3D3'})
                .addClass('tsp-next-disabled');
            }

            if(minDateObj && (minDateObj.toDateString() == selectedDate.toDateString())){
                $('.time-slot-picker-table .tsp-prev-btn-wrapper')
                .css({'cursor':'not-allowed','color':'#D3D3D3'})
                .addClass('tsp-prev-disabled');
            }
        }

        function setInputValue(){
            var selectedSlotTime = null;
            var selectedDateString = $('.time-slot-picker-table .title').text();

            if($('.tsp-active').length>0){
                selectedSlotTime = $('.tsp-active').text();
            }

            if(settings['inputElementSelector'] && $(settings['inputElementSelector']).length>0 && selectedSlotTime){
                var selectedDateTime = new Date(selectedDateString+' '+selectedSlotTime);

                var selectedDateTimeString = convertDateObjectToFormat(selectedDateTime, 'YYYY-MM-DD H:i:s');

                $(settings['inputElementSelector']).val(selectedDateTimeString).trigger('timeSlotSelected');
            }else{

            	if($(settings['inputElementSelector']).length>0 && $(settings['inputElementSelector']).val().length>0){
            		$(settings['inputElementSelector']).val('').trigger('timeSlotDiscarded');
            	}
            }
        }

        var maxDayTimeInMins = null;
        var minDayTimeInMins = null;
        var maxDateTimeInMins = null;
        var maxDateObj = null;
        var minDateTimeInMins = null;
        var minDateObj = null;

        var startTimeInMins = hhmm24HourTimeToMinutes(settings['startTime']);
        var endTimeInMins = hhmm24HourTimeToMinutes(settings['endTime']);

        if(settings['maxDayTime']){
            maxDayTimeInMins = hhmm24HourTimeToMinutes(settings['maxDayTime']);
        }

        if(settings['minDayTime']){
            minDayTimeInMins = hhmm24HourTimeToMinutes(settings['minDayTime']);
        }

        if(settings['maxDateTime']){
            maxDateObj = new Date(settings['maxDateTime']);
            maxDateTimeInMins = ((maxDateObj.getTime())/1000)/60;
        }

        if(settings['minDateTime']){
            minDateObj = new Date(settings['minDateTime']);
            minDateTimeInMins = ((minDateObj.getTime())/1000)/60;
        }

        rendertimeSlotPicker(new Date(settings['defaultDate']));

        $(document).on('click','.tsp-next-btn-wrapper:not(.tsp-next-disabled)',function(){
            days++;

            var d = new Date(settings['defaultDate']);
            d.setDate(d.getDate() + days);

            if(settings['skipWeekends']){
                var dayOfWeek = d.getDay();
                var isSaturday = (dayOfWeek === 6);
                var isSunday = (dayOfWeek  === 0);

                if(isSaturday){
                    d.setDate(d.getDate()+2);
                }else if(isSunday){
                    d.setDate(d.getDate()+1);
                }
            }

            rendertimeSlotPicker(d);
        });

        $(document).on('click','.tsp-prev-btn-wrapper:not(.tsp-prev-disabled)',function(){
            days--;
            var d = new Date(settings['defaultDate']);
            d.setDate(d.getDate() + days);

            if(settings['skipWeekends']){
                var dayOfWeek = d.getDay();
                var isSaturday = (dayOfWeek === 6);
                var isSunday = (dayOfWeek  === 0);

                if(isSaturday){
                    d.setDate(d.getDate()-1);
                }else if(isSunday){
                    d.setDate(d.getDate()-2);
                }
            }

            rendertimeSlotPicker(d);
        });

        $(document).on('mouseenter','.tsp-time-wrapper:not(.tsp-time-slot-disabled)',function(){
            $(this).not('.tsp-active').css({
                "background-color": "#916A44",
                "color":"#ffffff"
            });
        });

        $(document).on('mouseout','.tsp-time-wrapper:not(.tsp-time-slot-disabled)',function(){
            $(this).not('.tsp-active').css({
                "background-color": "#ffffff",
                "color":"#4A4B4E"
            });
        });

        $(document).on('click','.tsp-time-wrapper:not(.tsp-time-slot-disabled)',function(){
            $('.tsp-time-wrapper:not(.tsp-time-slot-disabled)').removeClass('tsp-active').css({
                "background-color": "#ffffff",
                "color":"#4A4B4E"
            });

            $(this).addClass('tsp-active').css({
                "background-color": "#916A44",
                "color":"#ffffff"
            });

            setInputValue();
        });

        return this;
    };

}( jQuery ));
