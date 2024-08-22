/*
 *  Variables
 */

// Get DOM primary elements
const cal = document.getElementById("calendar");
const main = document.getElementsByTagName("main")[0];
// var test2 = require("../holidays/us.json");
// // console.log(test2);
// fetch("file:///Users/user/Desktop/loymark/estebanTrejos.github.io/js/cr.json")
//   .then((response) => response.json())
//   .then((data) => console.log("test", data))
//   .catch((e) => console.error(e));

//console.log("test2", test);

// Customization variables
var useMonthShort = false,
  useDayShort = true;

// Validation rules
const validations = {
  required: function (value) {
    return value !== "";
  },
  dateFormat: function (value) {
    return value.match(
      /^((0[13578]|1[02])[\/|\-](0[1-9]|[12][0-9]|3[01])[\/|\-](18|19|20)[0-9]{2})|((0[469]|11)[\/|\-](0[1-9]|[12][0-9]|30)[\/|\-](18|19|20)[0-9]{2})|((02)[\/|\-](0[1-9]|1[0-9]|2[0-8])[\/|\-](18|19|20)[0-9]{2})|((02)[\/|\-]29[\/|\-](((18|19|20)(04|08|[2468][048]|[13579][26]))|2000))$/
    );
  },
  daysLength: function (value) {
    return value.match(/^([1-9][0-9]{0,2})$/);
  },
  countryCodeFormat: function (value) {
    return value.match(/^[a-zA-Z]{2}$/);
  },
};

// Validation error messages
var messages = {
  required: "Required field",
  dateFormat: "Invalid date format. Please use mm/dd/yyyy",
  daysLength: "Use only numeric chacters between 1 and 999.",
  countryCodeFormat: "Use only 2 letters for country code",
};

// Define month full names
var monthFull = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// Define day full names
var dayFull = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// Get today's date
var today = getTodayDate();
// Format day and month names
var monthName = formatNames("month", useMonthShort);
var dayName;

/*
 *  Helpers
 */

// Get todays date formatted as dd/mm/yyyy
function getTodayDate() {
  var now = new Date();
  return now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear();
}

// Get first day of a month
// Returns an integer. Eg: 4 => Thursday
function firstDayOfMonth(year, month) {
  var thisMonth = year + "/" + (month + 1) + "/1";
  return new Date(thisMonth).getDay();
}

// Get total days in a month
// Return an interger. Eg: 30
function totalDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Format day and month names
function formatNames(type, useShort) {
  var arrayFull = type === "month" ? monthFull : dayFull,
    arrayFinal;

  // If using short version of names
  if (useShort) {
    // Create a new empty array
    arrayFinal = [];

    // Iterate each name, slice first 3 charactes and push to new array
    for (var i = 0; i < arrayFull.length; i++) {
      arrayFinal.push(arrayFull[i].substr(0, 3));
    }
    // If using full version of names
  } else {
    // Create a shallow copy of original
    arrayFinal = arrayFull.slice();
  }

  // Return results
  return arrayFinal;
}

// Make calendar
function makeCalendar(dateStart, dateLength, countryCode) {
  // Parse dateLength value just to make sure we work with an integer
  dateLength = parseInt(dateLength);

  // Split date to ensure expected formatting (dd/mm/yyyy)
  var params = dateStart.split("/"),
    startDay = parseInt(params[1]),
    startMonth = parseInt(params[0] - 1),
    startYear = parseInt(params[2]),
    formatted = startYear + "/" + startMonth + "/" + startDay;

  // Create new month structure
  createNewMonth(startMonth, startYear);

  // Define temporal variables for loop
  var tempDay,
    tempMonth,
    tempYear,
    monthLimit,
    firstDay,
    tempCount = 0;

  // Iterate on user input length
  for (var j = 0; j <= dateLength; j++) {
    var isLast = j === dateLength;

    // First iteration (staring day)
    if (j === 0) {
      tempDay = startDay;
      tempMonth = startMonth;
      tempYear = startYear;
      monthLimit = totalDaysInMonth(tempYear, tempMonth);
      firstDay = firstDayOfMonth(tempYear, tempMonth);

      // Fix empty spaces array iteration length if week starts on monday
      var loopLen = tempDay - 1;

      // Add all invalid day spaces before start date
      addEmptyDaySpaces(tempYear, tempMonth, loopLen);
      // Current day number exceeds month total days
    } else if (tempDay + tempCount > monthLimit && !isLast) {
      // Reset temporal day counts
      tempCount = 0;
      tempDay = 1;

      // Reset temporal month and increment by one temporal year variable
      // if current month exceeds maximum amount of months in a year (11 > December)
      if (tempMonth === 11) {
        tempYear = tempYear + 1;
        tempMonth = 0;
        // else, increment temporal month variable by one
      } else {
        tempMonth = tempMonth + 1;
      }

      // Reset month limits and get new month's first day
      monthLimit = totalDaysInMonth(tempYear, tempMonth);
      firstDay = firstDayOfMonth(tempYear, tempMonth);

      // Create new month structure
      createNewMonth(tempMonth, tempYear);
    }

    if (!isLast) {
      var $month = document.getElementById(
        monthName[tempMonth] + "_" + tempYear
      );
      let $day_cell = document.createElement("li");
      let $day_name = document.createElement("span");

      // Add correct day number for new month structures
      $day_name.innerText = tempDay + tempCount;

      var weekend = tempDay + tempCount - 1 + firstDay,
        dateString = tempDay + tempCount + "/" + tempMonth;

      // Check if day is weekend and add class name for styling purposes
      if (weekend % 7 === 0 || (weekend + 1) % 7 === 0) {
        $day_cell.classList.add("weekend");
      }

      // Check if day is today and add class name for styling purposes
      if (dateString + "/" + tempYear === today) {
        $day_cell.classList.add("today");
      }

      // Check for holidays
      if (countryCode === "us") {
        if (usHolidays[dateString]) {
          $day_cell.classList.add("holiday");
          const holiday = usHolidays[dateString];
          $day_cell.addEventListener("click", () => {
            alert(holiday[0].name);
          });
        }
      } else if (countryCode === "cr") {
        if (crHolidays[dateString]) {
          $day_cell.classList.add("holiday");
          const holiday = crHolidays[dateString];
          $day_cell.addEventListener("click", () => {
            alert(holiday[0].name);
          });
        }
      } else {
        if (intHolidays[dateString]) {
          $day_cell.classList.add("holiday");
          const holiday = intHolidays[dateString];
          $day_cell.addEventListener("click", () => {
            alert(holiday[0].name);
          });
        }
      }

      // Append day name to month table container
      $day_cell.appendChild($day_name);
      $month.appendChild($day_cell);
    } else {
      // Add all invalid day spaces after end date
      fillEmptyMonth(tempYear, tempMonth, tempDay + tempCount, monthLimit);
    }

    // Increment temp day counter
    tempCount++;
  }

  // Remove loading class after all days/months are rendered
  window.setTimeout(function () {
    cal.parentNode.classList.remove("loading");
    document.getElementById("show-calendar").innerHTML = "Update Calendar";
  }, 1500);
}

function createNewMonth(curMonth, curYear) {
  dayName = formatNames("day", useDayShort);
  // Create month wrapper structure
  let $month_wrapper = document.createElement("div");

  // Add month wrapper class based on version of week day names (full || short)
  $month_wrapper.className = !useDayShort ? "month big" : "month";

  // Append month wrapper to calendar
  cal.appendChild($month_wrapper);

  // Create month header and add month name
  let $month_header = document.createElement("h2");
  $month_header.className = "month_title";
  $month_header.innerText = monthName[curMonth] + " " + curYear;

  // Append header to month wrapper
  $month_wrapper.appendChild($month_header);

  // Create week day names header
  let $week_header = document.createElement("ol");
  $week_header.className = "week_title";

  // Create day numbers container
  let $days = document.createElement("ol");
  var monthId = monthName[curMonth] + "_" + curYear;
  $days.id = monthId;
  $days.className = "week_days";

  // Append week name header to month wrapper
  $month_wrapper.appendChild($week_header);
  // Append day numbers container to month wrapper
  $month_wrapper.appendChild($days);

  // Iterate on days of week
  for (var i = 0; i < dayName.length; i++) {
    let $day_cell = document.createElement("li");
    let $day_name = document.createElement("span");

    // Add day name
    $day_name.innerText = dayName[i];
    // Append day name to list item
    $day_cell.appendChild($day_name);
    // Append list item to week row
    $week_header.appendChild($day_cell);
  }

  // Get first day in month for use as empty space length
  var firstDay = firstDayOfMonth(curYear, curMonth);

  // Add all empty day spaces before first day of month
  addEmptyDaySpaces(curYear, curMonth, firstDay);
}

// Fill days on calendar before user selected date
function addEmptyDaySpaces(year, month, length) {
  var firstDay = firstDayOfMonth(year, month);
  var monthId = monthName[month] + "_" + year;
  var $month = document.getElementById(monthId);
  var loopLen = length;

  for (var i = 0; i < loopLen; i++) {
    var $day_cell = document.createElement("li");
    var $day_name = document.createElement("span");
    var weekend = i + firstDay;

    $day_name.className = "empty";
    $day_name.innerText = "-";

    // Append month name to month table container
    $day_cell.appendChild($day_name);
    $month.appendChild($day_cell);
  }
}

// Fill days on calendar after user input length
function fillEmptyMonth(year, month, start, length) {
  var firstDay = firstDayOfMonth(year, month);
  var monthId = monthName[month] + "_" + year;
  var $month = document.getElementById(monthId);
  var loopLen = length;

  for (var i = start - 1; i < loopLen; i++) {
    var $day_cell = document.createElement("li");
    var $day_name = document.createElement("span");

    $day_name.className = "disabled";
    $day_name.innerText = i + 1;

    // Append month name to month table container
    $day_cell.appendChild($day_name);
    $month.appendChild($day_cell);
  }
}

function addHolidays() {}

// Validate form data and submit
function validateForm() {
  var formElem = document.getElementById("cal_form"),
    inputArray = formElem.querySelectorAll("input");

  // Add classname 'used' if input has a value
  for (var k = 0; k < inputArray.length; k++) {
    inputArray[k].addEventListener("blur", function (e) {
      if (!this.value) {
        this.classList.remove("used");
      } else {
        this.classList.add("used");
      }
    });
  }

  formElem.addEventListener(
    "submit",
    function (e) {
      e.preventDefault();

      var errorsLen = 0,
        i = 0;

      while (i < inputArray.length) {
        var attr = inputArray[i].getAttribute("data-validation"),
          rules = attr ? attr.split(" ") : "",
          parent = inputArray[i].parentNode,
          j = 0;

        while (j < rules.length) {
          var inputName = inputArray[i].getAttribute("name"),
            elError = document.getElementById(inputName + "-error");

          if (!validations[rules[j]](inputArray[i].value)) {
            e.preventDefault();

            if (!elError) {
              elError = document.createElement("span");
              elError.id = inputName + "-error";
              elError.classList.add("error");

              parent.appendChild(elError);
            }

            elError.innerHTML = messages[rules[j]];
            inputArray[i].classList.add("error");
            errorsLen++;

            break;
          } else {
            if (elError) {
              elError.parentNode.removeChild(elError);
            }

            inputArray[i].classList.remove("error");
          }

          j++;
        }

        i++;
      }

      if (!errorsLen) {
        main.classList.add("with-data");
        cal.parentNode.classList.add("loading");

        while (cal.hasChildNodes()) {
          cal.removeChild(cal.lastChild);
        }

        cal.scrollTop = 0;
        makeCalendar(
          inputArray[0].value,
          inputArray[1].value,
          inputArray[2].value
        );
      }
    },
    false
  );
}

validateForm();

//Hey guys, I'm really sorry to incrust JSONs files here, I had few issues importing the documents an any try works
//I understood is not the cleanest way to make the exercise but I lost a lot of time trying to fix the imports
//without success, so I prefer to put them here and finish the exercise.
const crHolidays = {
  "1/0": [
    {
      name: "Año Nuevo",
    },
  ],
  "14/1": [
    {
      name: "Día del Amor y la Amistad",
    },
  ],
  "8/2": [
    {
      name: "Día Internacional de la Mujer",
    },
  ],
  "19/2": [
    {
      name: "Día de San José",
    },
  ],
  "20/2": [
    {
      name: "Aniversario de la Batalla de Santa Rosa",
    },
  ],
  "11/3": [
    {
      name: "Batalla de Rivas",
    },
  ],
  "22/3": [
    {
      name: "Día Internacional de la Tierra",
    },
  ],
  "23/3": [
    {
      name: "Día del Libro",
    },
  ],
  "1/4": [
    {
      name: "Día Internacional de los Trabajadores",
    },
  ],
  "15/5": [
    {
      name: "Día del Árbol",
    },
  ],
  "25/6": [
    {
      name: "Anexión del Partido de Nicoya",
    },
  ],
  "30/6": [
    {
      name: "Día de Guanacaste",
    },
  ],
  "2/7": [
    {
      name: "Día de la Virgen de los Ángeles",
    },
  ],
  "24/7": [
    {
      name: "Día de los Parques Nacionales",
    },
  ],
  "31/7": [
    {
      name: "Día del Negro y la Cultura Afrocostarricense",
    },
  ],
  "9/8": [
    {
      name: "Día del Niño",
    },
  ],
  "15/8": [
    {
      name: "Día de la Independencia",
    },
  ],
  "12/9": [
    {
      name: "Día de las Culturas",
    },
  ],
  "31/9": [
    {
      name: "Día de la Mascarada Costarricense",
    },
  ],
  "2/10": [
    {
      name: "Día de los Fieles Difuntos",
    },
  ],
  "22/10": [
    {
      name: "Día del Educador",
    },
  ],
  "24/11": [
    {
      name: "Nochebuena",
    },
  ],
  "25/11": [
    {
      name: "Navidad",
    },
  ],
  "28/11": [
    {
      name: "Día de los Inocentes",
    },
  ],
  "31/11": [
    {
      name: "Fin de Año",
    },
  ],
};

const usHolidays = {
  "1/0": [
    {
      name: "New Year's Day",
    },
  ],
  "6/0": [
    {
      name: "Epiphany",
    },
  ],
  "7/0": [
    {
      name: "Orthodox Christmas",
    },
  ],
  "16/0": [
    {
      name: "Martin Luther King, Jr. Day",
    },
  ],
  "2/1": [
    {
      name: "Groundhog Day",
    },
  ],
  "14/1": [
    {
      name: "Valentine's Day",
    },
  ],
  "20/1": [
    {
      name: "George Washington's Birthday",
    },
  ],
  "17/2": [
    {
      name: "St. Patrick's Day",
    },
  ],
  "1/3": [
    {
      name: "April Fools' Day",
    },
  ],
  "22/3": [
    {
      name: "Earth Day",
    },
  ],
  "28/3": [
    {
      name: "National Arbor Day",
    },
  ],
  "1/4": [
    {
      name: "May Day",
    },
  ],
  "4/4": [
    {
      name: "Star Wars Day",
    },
  ],
  "5/4": [
    {
      name: "Cinco de Mayo",
    },
  ],
  "14/5": [
    {
      name: "Flag Day",
    },
  ],
  "27/5": [
    {
      name: "Helen Keller Day",
    },
  ],
  "4/6": [
    {
      name: "Independence Day",
    },
  ],
  "26/7": [
    {
      name: "Women's Equality Day",
    },
  ],
  "17/8": [
    {
      name: "Constitution Day",
    },
  ],
  "6/9": [
    {
      name: "German-American Day",
    },
  ],
  "9/9": [
    {
      name: "Leif Erikson Day",
    },
  ],
  "31/9": [
    {
      name: "Halloween",
    },
  ],
  "11/10": [
    {
      name: "Veterans Day",
    },
  ],
  "7/11": [
    {
      name: "Pearl Harbor Remembrance Day",
    },
  ],
  "8/11": [
    {
      name: "Immaculate Conception of the Virgin Mary",
    },
  ],
  "24/11": [
    {
      name: "Christmas Eve",
    },
  ],
  "25/11": [
    {
      name: "Christmas Day",
    },
  ],
  "31/11": [
    {
      name: "New Year's Eve",
    },
  ],
};

const intHolidays = {
  "1/0": [
    {
      name: "New Year's Day",
    },
  ],
  "4/1": [
    {
      name: "World Cancer Day",
    },
  ],
  "11/1": [
    {
      name: "International Day of Women and Girls in Science",
    },
  ],
  "20/1": [
    {
      name: "World Day of Social Justice",
    },
  ],
  "21/1": [
    {
      name: "International Mother Language Day",
    },
  ],
  "1/2": [
    {
      name: "Zero Discrimination Day",
    },
  ],
  "3/2": [
    {
      name: "World Wildlife Day",
    },
  ],
  "8/2": [
    {
      name: "International Women's Day",
    },
  ],
  "20/2": [
    {
      name: "International Day of Happiness",
    },
  ],
  "21/2": [
    {
      name: "World Down Syndrome Day",
    },
  ],
  "22/2": [
    {
      name: "World Water Day",
    },
  ],
  "2/3": [
    {
      name: "World Autism Awareness Day",
    },
  ],
  "7/3": [
    {
      name: "World Health Day",
    },
  ],
  "22/3": [
    {
      name: "International Mother Earth Day",
    },
  ],
  "3/4": [
    {
      name: "World Press Freedom Day",
    },
  ],
  "15/4": [
    {
      name: "International Day of Families",
    },
  ],
  "5/5": [
    {
      name: "World Environment Day",
    },
  ],
  "20/5": [
    {
      name: "World Refugee Day",
    },
  ],
  "30/5": [
    {
      name: "International Asteroid Day",
    },
  ],
  "11/6": [
    {
      name: "World Population Day",
    },
  ],
  "18/6": [
    {
      name: "Nelson Mandela International Day",
    },
  ],
  "9/7": [
    {
      name: "International Day of the World's Indigenous Peoples",
    },
  ],
  "5/8": [
    {
      name: "International Day of Charity",
    },
  ],
  "8/8": [
    {
      name: "International Literacy Day",
    },
  ],
  "15/8": [
    {
      name: "International Day of Democracy",
    },
  ],
  "27/8": [
    {
      name: "World Tourism Day",
    },
  ],
  "5/9": [
    {
      name: "World Teacher's Day",
    },
  ],
  "16/9": [
    {
      name: "World Food Day",
    },
  ],
  "24/9": [
    {
      name: "United Nations Day",
    },
  ],
  "14/10": [
    {
      name: "World Diabetes Day",
    },
  ],
  "20/10": [
    {
      name: "Universal Children's Day",
    },
  ],
  "1/11": [
    {
      name: "World AIDS Day",
    },
  ],
  "10/11": [
    {
      name: "Human Rights Day",
    },
  ],
  "18/11": [
    {
      name: "International Migrants Day",
    },
  ],
  "20/11": [
    {
      name: "International Human Solidarity Day",
    },
  ],
  "24/11": [
    {
      name: "Christmas Eve",
    },
  ],
  "25/11": [
    {
      name: "Christmas Day",
    },
  ],
  "31/11": [
    {
      name: "New Year's Eve",
    },
  ],
};
