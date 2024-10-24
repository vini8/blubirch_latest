let letsBeginButton = $(".lets-begin")
let returns_impact_calculator = $("#returns_impact_calculator")
let returns_impact_calculator_form = $("#returns_impact_calculator-form")
let return_impact_calculator_result_section = $("#return-impact-calculator-result-section")
let recheck_download_button = $(".recheck-download-button")
let business_form_inner = $(".business-form-inner")
var input = document.querySelector("#phone");

const iti = window.intlTelInput(input, {
    utilsScript: "/intl-tel-input/js/utils.js?1695806485509",
    separateDialCode: true,
    initialCountry: "auto",
    geoIpLookup: function (callback) {
        // fetch("https://ipapi.co/json/")
        // .then(function(res) { return res.json(); })
        // .then(function(data) { callback(data.country_code); })
        // .catch(function() { callback("IN"); });
        callback("IN");
    }
});



letsBeginButton.click(() => {
    returns_impact_calculator.hide();
    returns_impact_calculator_form.show()
})

business_form_inner.find('.required').on('input', function () {
    var activeStep = $(this).closest('.step');
    var inputs = activeStep.find('.required');
    var allFieldsFilled = true;
    var nextButton = activeStep.find('.open-otp-modal');
    if (nextButton.length === 0) {
        nextButton = activeStep.find('.submit-generate-results')
    }
    inputs.each(function () {
        var inputValue = $(this).val() ? $(this).val().trim() : "";
        if (inputValue === '') {
            allFieldsFilled = false;
            return false; // Exit the loop early
        } else {
            allFieldsFilled = true;
            $(this).removeClass('invalid');
        }

    });
    if (inputs.hasClass('invalid')) {
        allFieldsFilled = false;
    }
    nextButton.addClass(!allFieldsFilled ? 'next-sbtn' : 'next-enabled');
    nextButton.removeClass(allFieldsFilled ? 'next-sbtn' : 'next-enabled');
    nextButton.prop('disabled', !allFieldsFilled);
});

return_impact_calculator_result_section.find('.required').on('input', function () {
    var inputs = return_impact_calculator_result_section.find('.required');
    var allFieldsFilled = true;
    var nextButton = $('.submit-return-impact-generate-results');
        inputs.each(function () {
       var inputValue = $(this).val().trim();
       if (inputValue === '') {
          allFieldsFilled = false;
          return false; // Exit the loop early
       } else {
          allFieldsFilled = true;
          $(this).removeClass("invalid")
       }
    });

    if (inputs.hasClass('invalid')) {
       allFieldsFilled = false;
    }
    nextButton.addClass(!allFieldsFilled ? 'next-sbtn' : 'next-enabled px-3');
    nextButton.removeClass(allFieldsFilled ? 'next-sbtn' : 'next-enabled px-3');
    nextButton.prop('disabled', !allFieldsFilled);
 });



function isValidStep(step) {
    var inputs = step.find('input.required'); // Adjust the selector according to your form
    var selectSBoxs = step.find('select.required')
    var valid = true;

    selectSBoxs.each(function () {
        if (($(this).val() === '') || ($(this).val() === null)) {
            valid = false;
            $(this).addClass('invalid');
        }
    })

    inputs.each(function () {
        if ($(this).is(':radio')) { // Handle radio buttons
            var radioName = $(this).attr('name');
            if (!$('input[name="' + radioName + '"]:checked').length) {
                valid = false;
                // $(this).addClass('invalid');
            } else {
                // $(this).removeClass('invalid');
            }
        } else if ($(this).val() === '') {
            valid = false;
            $(this).addClass('invalid');
        } else {
            var inputValue = $(this).val().trim();
            if ($(this).attr('id') === 'phone') { // Check if input is empty or not a number
                if (iti.isValidNumber()) {
                    $(this).removeClass('invalid');
                } else {
                    console.log("this is runnnn");
                    $(this).addClass('invalid');
                    valid = false;
                    const errorCode = iti.getValidationError();
                    console.log(errorCode, ":::: errorCode");
                }
                // $(this).addClass('invalid');
            } else {
                $(this).removeClass('invalid');
            }

        }
    });
    return valid;
}

$.fn.openStep = function (step, callback) {
    $this = this;
    step_num = step - 1;
    let currency_dropdown = $('.currency_dropdown')
    if (step === 2) {
        currency_dropdown.show()
    } else {
        currency_dropdown.hide()
    }
    step = this.find('.step:visible:eq(' + step_num + ')');
    var targetPosition = step_num * (step.outerHeight() * 1.7);
    window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
    })
    if (step.hasClass('active')) return;
    active = this.find('.step.active');
    prev_active = next = $(this.children('.step:visible')).index($(active));
    order = step_num > prev_active ? 1 : 0;
    if (active.hasClass('feedbacking')) $this.destroyFeedback();
    active.closeAction(order);
    step.openAction(order, function () {
        $this.trigger('stepchange').trigger('step' + (step_num + 1));
        if (step.data('event')) $this.trigger(step.data('event'));
        if (callback) callback();
    });
};



$.fn.nextStep = function (ignorefb) {
    stepper = this;
    form = this.closest('form');
    active = this.find('.step.active');
    next = $(this.children('.step:visible')).index($(active)) + 2;
    feedback = $(active.find('.step-content').find('.step-actions').find('.next-step')).data("feedback");
    if (isValidStep(active)) {
        if (feedback && ignorefb) {
            stepper.activateFeedback();
            return window[feedback].call();
        }
        active.removeClass('wrong').addClass('done');
        this.openStep(next);
        return this.trigger('nextstep');
    } else {
        return active.removeClass('done').addClass('wrong');
    }
};

$.fn.prevStep = function () {
    active = this.find('.step.active');
    prev = $(this.children('.step:visible')).index($(active));
    active.removeClass('wrong');
    this.openStep(prev);
    return this.trigger('prevstep');
};

$(".previous-step-show").on('click', function () {
    recheck_download_button.hide();
    business_form_inner.show()
    return_impact_calculator_result_section.hide()
})


$.fn.openAction = function (order, callback) {
    openable = this.removeClass('done').addClass('active').find('.step-content');
    if (!this.closest('ul').hasClass('horizontal')) {
        openable.slideDown(300, "easeOutQuad", callback);
    } else {
        if (order == 1) {
            openable.css({
                left: '100%',
                display: 'block'
            }).animate({
                left: '0%'
            }, callback);
        } else {
            openable.css({
                left: '-100%',
                display: 'block'
            }).animate({
                left: '0%'
            }, callback);
        }
    }
};

$.fn.closeAction = function (order, callback) {
    closable = this.removeClass('active').find('.step-content');
    if (!this.closest('ul').hasClass('horizontal')) {
        closable.stop().slideUp(300, "easeOutQuad", callback);
    } else {
        if (order == 1) {
            closable.animate({
                left: '-100%'
            }, function () {
                closable.css({
                    display: 'none',
                    left: '0%'
                }, callback);
            });
        } else {
            closable.animate({
                left: '100%'
            }, function () {
                closable.css({
                    display: 'none',
                    left: '0%'
                }, callback);
            });
        }
    }
};

function chnageInNumber(value, name) {
    let fieldName = ['avg_unit_sales_price', 'annual_revenue_in_cr']
    if (fieldName.includes(name)) {
        return parseFloat(value.replace(/,/g, ''));
    } else {
        return false
    }
}
$.fn.handleSubmit = async function (event) {
    event.preventDefault();
    active = this.find('.step.active');
    if (isValidStep(active)) {
        recheck_download_button.show();
        business_form_inner.hide()
        return_impact_calculator_result_section.show()
    } else {
        return active.removeClass('done').addClass('wrong');
    }
}

function sendOtp () {
    let assessment = $('#assessment')
    let assessment_value = {}
    assessment.find('input[type="text"] , select').each(function () {
        var fieldName = $(this).attr('name');
        var fieldValue = $(this).val();
        assessment_value[fieldName] = fieldValue;
    });
    console.log(assessment_value , "::::: assessment_value");
    // fetch('url', {
    //     method: "POST",
    //     body: JSON.stringify({ user_details: assessment_value }),
    //     headers: {
    //         "Content-type": "application/json; charset=UTF-8"
    //     }
    // })
    //     .then(response => response.json())
    //     .then(result => {
    //         if (result.success) {
    //         }
    //     }).catch((err) => {
    //     alert("something went wrong")
    // })
}
$.fn.toggelModal = async function (type) {
    active = this.find('.step.active');
    if (isValidStep(active)) {
        if (type) {
            $('#otpModal').modal('show');
            sendOtp()
           
            // console.log(assessment_value , "::: assessment_value");
        } else {
            var otpInputs = document.querySelectorAll('#otp input');

            var otpValue = Array.from(otpInputs).map(function(input) {
              return input.value;
            }).join('');
            console.log(otpValue , ":::: otpValue");
            // let otp = "6789"
            // fetch('url', {
            //     method: "POST",
            //     body: JSON.stringify({ OTP : otpValue }),
            //     headers: {
            //         "Content-type": "application/json; charset=UTF-8"
            //     }
            // })
            //     .then(response => response.json())
            //     .then(result => {
            //         if (result.success) {
                $('#otpModal').modal('hide');

                active = this.find('.step.active');
                next = $(this.children('.step:visible')).index($(active)) + 2;
                this.openStep(next);
            //         }
            //     }).catch((err) => {
            // let inputs = $(".otp-field > input");
            // inputs.forEach((input) => {
            //     input.addClass("otp_error")
            // })
            //     alert("something went wrong or OTP is wrong")
            // })
        }
    }
}

$.fn.activateStepper = function () {
    $(this).each(function () {
        var $stepper = $(this);
        $stepper.find('li.step.active').openAction(1);
        $stepper.on("click", '.step:not(.active)', function () {
            object = $($stepper.children('.step:visible')).index($(this));
            if (!$stepper.hasClass('linear')) {
                $stepper.openStep(object + 1);
            } else {
                active = $stepper.find('.step.active');
                if ($($stepper.children('.step:visible')).index($(active)) + 1 == object) {
                    $stepper.nextStep(true);
                } else if ($($stepper.children('.step:visible')).index($(active)) - 1 == object) {
                    $stepper.prevStep();
                }
            }
        })
        .on("click", '.open-otp-modal', function (e) {
            e.preventDefault();
            $stepper.toggelModal(true)
        }).on("click", '.modal-otp-close', function (e) {
            e.preventDefault();
            // $stepper.toggelModal(true)
            $('#otpModal').modal('hide');
            let inputs = $(".otp-field > input");
            inputs.forEach((input) => {
                // input.addClass("otp_error")
                input.val("")
            })
        }).on("click", '.resend-otp-btn', function (e) {
            e.preventDefault();
            console.log("this is run   ");
            sendOtp()

        }).on("click", '.submit-otp', function (e) {
            e.preventDefault();
            $stepper.toggelModal(false)
        }).on("click", '.next-step', function (e) {
            e.preventDefault();
            $stepper.nextStep(true);
        }).on("click", '.previous-step', function (e) {
            e.preventDefault();
            $stepper.prevStep();
            // May want to ammend to 'a' tag for R purposes or more than likely use an ID selector
            // for shiny observer purposes... so for R if the action button for submissions was 
            // `input$form_step_submit`:
            //}).on("click", "#form_step_submit", function(e) { 
        })
            .on("click", "button:submit:not(.open-otp-modal, .modal-otp-close, .resend-otp-btn, .submit-otp, .next-step, .previous-step)", function (e) {
                e.preventDefault();
                $stepper.handleSubmit(e)
            });
    });
};

function getCategoriesList() {
    localStorage.removeItem("returns_calculator")
    const CATEGORIES_LIST = getApiUrl('CATEGORIES_LIST');
    fetch(CATEGORIES_LIST)
        .then(response => response.json())
        .then(result => {
            let option = $("#categories_list")
            let optionList = result.map(value => `<option value="${value}">${value}</option>`)
            option.append(optionList)
        })
}

$("#currency_list").on('change', function () {
    var inputValue = $(this).val()
    let currencyEl = $(".currency_type")
    currencyEl.each(function () {
        $(this).css({ color: "#000" })
        $(this).html(inputValue === "₹" ? '₹' : inputValue)
    })
    $(".currency_tens").each(function () {
        $(this).html(inputValue === "₹" ? 'CR' : "")
    })

    $(".format_in_currency").each(function () {
        let currencyValue = parseFloat($(this).val().replace(/,/g, ''));
        if (!currencyValue) return
        let formmatingType = ["INR", "₹", "Rs", "₨"].includes(inputValue) ? 'en-IN' : 'en-US'
        var formattedValue = parseFloat(currencyValue).toLocaleString(formmatingType);
        $(this).val(formattedValue);
    })
});
let currenciesSymbolsb = [
    "€",
    "د.إ.‏",
    "؋",
    "$",
    "Lek",
    "դր.",
    "Kz",
    "Afl.",
    "ман.",
    "KM",
    "৳",
    "CFA",
    "лв.",
    "د.ب.‏",
    "FBu",
    "Bs",
    "R$",
    "Nu.",
    "kr",
    "P",
    "руб.",
    "FrCD",
    "FCFA",
    "CHF",
    "CN¥",
    "₡",
    "₱",
    "CV$",
    "ƒ",
    "Kč",
    "Fdj",
    "RD$",
    "د.ج.‏",
    "ج.م.‏",
    "د.م.‏",
    "Nfk",
    "Br",
    "£",
    "GEL",
    "GH₵",
    "D",
    "FG",
    "Q",
    "L",
    "kn",
    "G",
    "Ft",
    "Rp",
    "₪",
    "₹",
    "د.ع.‏",
    "﷼",
    "د.أ.‏",
    "￥",
    "Ksh",
    "С̲ ",
    "៛",
    "FC",
    "₩",
    "د.ك.‏",
    "тңг.",
    "₭",
    "ل.ل.‏",
    "SL Re",
    "د.ل.‏",
    "MDL",
    "MGA",
    "MKD",
    "K",
    "₮",
    "MOP$",
    "MURs",
    "ރ",
    "RM",
    "MTn",
    "N$",
    "F",
    "₦",
    "C$",
    "नेरू",
    "ر.ع.‏",
    "B/.",
    "S/.",
    "₨",
    "zł",
    "₲",
    "ر.ق.‏",
    "RON",
    "дин.",
    "₽.",
    "FR",
    "ر.س.‏",
    "SR",
    "SDG",
    "Le",
    "Ssh",
    "ل.س.‏",
    "฿",
    "SM",
    "T",
    "د.ت.‏",
    "T$",
    "TL",
    "NT$",
    "TSh",
    "₴",
    "USh",
    "UZS",
    "Bs.F.",
    "₫",
    "VT",
    "ST",
    "ر.ي.‏",
    "R",
    "ZK",
    "ZWL$",
    "UM",
    "Db"
]
const currenciesSymbols = ['$', '€', '£', 'د.إ', 'S$', '₹'];
function getCurrencyList() {
    // fetch("https://openexchangerates.org/api/currencies.json")
    //     .then(response => response.json())
    //     .then(result => {
    let option = $("#currency_list")
    //         let currencies = Object.keys(result)
    let optionList = currenciesSymbols.map(value => ['₹', "₨"].includes(value) ? `<option value="${value}" selected>${value}</option>` : `<option value="${value}">${value}</option>`)
    option.append(optionList)
    let currencyEl = $(".currency_type")
    currencyEl.each(function () {
        $(this).css({ color: "#000" })
        $(this).html('₹')
    })
    $(".currency_tens").each(function () {
        $(this).html('CR')
    })
    //     })
}
$(document).ready(function () {
    //    $('ul.tabs').tabs()
    //    $('.rt-select').material_select();
    //Init for stepper
    $('.stepper').activateStepper();
    recheck_download_button.hide();
    $('#result-section').hide()
    $("#loading").hide()

    $('#download-report').prop('disabled', true);
    //$(selector).nextStep();
    // /returns_calculator/categories_list 
    getCategoriesList()
    getCurrencyList()
    return_impact_calculator_result_section.hide()
});


function changeInNumber(value, name) {
    let fieldName = ['inventory_ageing_in_months']
    if (fieldName.includes(name)) {
        return parseFloat(value.replace(/,/g, ''));
    } else {
        return false
    }
}

function formatNumber(value, currency_type) {
    var number = parseFloat(value);
    // let formmatingType = currency_type === "INR" ? 'en-IN' : 'en-US'
    let formmatingType = ["INR", "₹", "Rs", "₨"].includes(currency_type) ? 'en-IN' : 'en-US'

    if (Number.isInteger(number)) {
        return number.toLocaleString(formmatingType, { maximumFractionDigits: 0 });
    } else {
        return number.toLocaleString(formmatingType, { maximumFractionDigits: 2 });
    }
}

function generateStep(inputNumber) {
    const steps = 3;
    const interval = Math.ceil(inputNumber / steps);

    const result = Array.from({ length: 2 * steps + 1 }, (_, index) => {
        const value = (index - steps) * interval;
        return Math.min(Math.max(value, -inputNumber), inputNumber);
    });

    return result;
}

function graphPercent(graphValue, maxStep) {
    return (graphValue * 100) / maxStep
}

$('.submit-return-impact-generate-results').on('click', async function () {
    $(this).prop('disabled', true);

    var actual_values_inputs = $('#actual_values')
    var targeted_values_inputs = $('#targeted_values')
    var assessment = $('#assessment')
    var assets_input = $('#assets_input')
    var formData = {};
    var assessment_value = {}
    var policies_value = {}

    assessment.find('input[type="text"] , select').each(function () {
        var fieldName = $(this).attr('name');
        var fieldValue = $(this).val();
        assessment_value[fieldName] = fieldValue;
    });


    var countryCode = await iti.promise.then(function () {
        const countryData = iti.getSelectedCountryData();
        return countryData.dialCode;
    });
    assets_input.find('input[type="text"], select').each(function (index) {
        var fieldName = $(this).attr('name');
        var fieldValue = $(this).val();
        let numberValue = chnageInNumber(fieldValue, fieldName)
        policies_value[fieldName] = isNaN(fieldValue) ? numberValue ? numberValue : fieldValue : Number(fieldValue);
    });


    let actual_values = {}
    let targeted_values = {}
    
    actual_values_inputs.find('input[type="text"]').each(function () {
        var fieldName = $(this).attr('name');
        var fieldValue = $(this).val();
        let numberValue = changeInNumber(fieldValue, fieldName)
        actual_values[fieldName] = isNaN(fieldValue) ? numberValue ? numberValue : fieldValue : Number(fieldValue);
    });

    targeted_values_inputs.find('input[type="text"]').each(function () {
        var fieldName = $(this).attr('name');
        var fieldValue = $(this).val();
        let numberValue = changeInNumber(fieldValue, fieldName)

        targeted_values[fieldName] = isNaN(fieldValue) ? numberValue ? numberValue : fieldValue : Number(fieldValue);
    });

    formData = {
        ...assessment_value,
        currency: policies_value.currency,
        country_code: countryCode,
        asset_inputs: {
            ...policies_value,
            actual_values,
            targeted_values
        }
    }

    let returns_cost = $("#returns_cost")
    let returns_impact = $("#returns_impact")
    let opportunity_table = $('#opportunity')
    let return_unit = $("#return-unit")
    let userName = $("#userName")
    $("#loading").show()
    $('#result-section').hide()

    const RETURNS_CALCULATOR = getApiUrl('RETURNS_CALCULATOR');
    fetch(RETURNS_CALCULATOR, {
        method: "POST",
        body: JSON.stringify({ returns_calculator: formData }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                $('#result-section').show()
                $('#download-report').prop('disabled', false);
                let currency_type = result.data.currency

                $('#download-report').attr('href', 'https://qa-docker.blubirch.com:3064/returns_calculator_result/download.pdf?id=' + result.data.returns_calculator_result_id)
                let Actual_result = result.data.result['Returns Cost']["Cost of Return Per Unit[INR]"]["Actual result"]
                let Targeted_desired_result = result.data.result['Returns Cost']["Cost of Return Per Unit[INR]"]["Targeted/desired result"]
                let Number_Actual_result = result.data.result['Returns Cost']["Number of Fresh Sales to Recover Cost of One Return"]["Actual result"]
                let Number_Targeted_desired_result = result.data.result['Returns Cost']["Number of Fresh Sales to Recover Cost of One Return"]["Targeted/desired result"]
                let return_cost_actual_result = result.data.result['Returns Impact']["Return Cost as % of Sales Revenue"]["Actual result"]
                let return_cost_Targeted_desired_result = result.data.result['Returns Impact']["Return Cost as % of Sales Revenue"]["Targeted/desired result"]
                let operating_profit_Actual_result = result.data.result['Returns Impact']["Return Cost as % of Operating Profit"]["Actual result"]
                let operating_profit_Targeted_desired_result = result.data.result['Returns Impact']["Return Cost as % of Operating Profit"]["Targeted/desired result"]
                let Opportunity_Returns_cost = result.data.result.Opportunity['Reduction in Returns Cost']
                let OpportunityOperatingProfit = result.data.result.Opportunity['Increase in Operating Profit']
                let Opportunity_Operating_Profit_cr = result.data.result.Opportunity['Absolute Increase in Annual Operating Profit[INR Cr]']
                let GenerateResultInPercent = ((Actual_result - Targeted_desired_result) / Actual_result) * 100
                let stepCount = Math.abs(Opportunity_Returns_cost) > Math.abs(OpportunityOperatingProfit) ? Math.abs(Opportunity_Returns_cost) : Math.abs(OpportunityOperatingProfit)
                let stepRoundNumber = (Math.floor(stepCount / 10) * 10) + 10
                let steps = generateStep(stepRoundNumber)
                let return_unit_perecent = $(".return_unit_perecent")
                let actual_cost_one_return = $(".actual_cost_one_return")
                let targeted_cost_one_return = $(".targeted_cost_one_return")
                let impact_cost_sales_revenue = $(".impact_cost_sales_revenue")
                let targeted_cost_sales_revenue = $(".targeted_cost_sales_revenue")
                let impact_cost_operating_profit = $(".impact_cost_operating_profit")
                let impact_targeted_cost_operating_profit = $(".impact_targeted_cost_operating_profit")
                let opportunity_returns_cost = $(".opportunity_returns_cost")
                let remaining_actual_targeted = $(".remaining_actual_targeted")
                let opportunity_operating_profit = $(".opportunity_operating_profit")
                let opportunity_annual_operating_profit = $(".opportunity_annual_operating_profit")
                let $reduction_returns_cost = $(".reduction_returns_cost")
                let increase_returns_cost = $(".increase_returns_cost")
                let $increase_operating = $(".increase_operating")
                let reduction_operating = $(".reduction_operating")
                let graph_steps = $(".graph-steps ul")

                let reduction_returns_cost_graph = $(".reduction_returns_cost_graph")
                let increase_returns_cost_graph = $(".increase_returns_cost_graph")
                let reduction_operating_graph = $(".reduction_operating_graph")
                let increase_operating_graph = $(".increase_operating_graph")


                let stepLiElements = steps.map(item => `<li>${item}%</li>`)

                graph_steps.html(stepLiElements)
                userName.html(result.data.name)
                return_unit_perecent.html(`${formatNumber(GenerateResultInPercent, currency_type)}%`)
                actual_cost_one_return.html(Number_Actual_result.toFixed(0))
                targeted_cost_one_return.html(Number_Targeted_desired_result.toFixed(0))
                impact_cost_sales_revenue.html(`${return_cost_actual_result}%`)
                targeted_cost_sales_revenue.html(`${return_cost_Targeted_desired_result}%`)
                impact_cost_operating_profit.html(`${operating_profit_Actual_result}%`)
                impact_targeted_cost_operating_profit.html(`${operating_profit_Targeted_desired_result}%`)
                opportunity_returns_cost.html(`${Opportunity_Returns_cost.toFixed(0)}% `)

                remaining_actual_targeted.html(`(${formatNumber((Actual_result - Targeted_desired_result).toFixed(0))} ${currency_type})`)
                opportunity_operating_profit.html(`${OpportunityOperatingProfit}%`)
                opportunity_annual_operating_profit.html(`${formatNumber(Opportunity_Operating_Profit_cr.toFixed(0))} ${currency_type} ${['₹', "₨"].includes(currency_type) ? "CR" : ""}`)
                $reduction_returns_cost.css({ width: `${graphPercent(Math.abs(Opportunity_Returns_cost), stepRoundNumber)}%` })
                $increase_operating.css({ width: `${graphPercent(Math.abs(OpportunityOperatingProfit), stepRoundNumber)}%` })

                // less-red-value
                if (Opportunity_Returns_cost > 0) {
                    reduction_returns_cost_graph.css({ visibility: 'visible' })
                    increase_returns_cost_graph.css({ visibility: 'hidden' })
                    if (graphPercent(Math.abs(Opportunity_Returns_cost), stepRoundNumber) < 25) {
                        $(".less_reduction_returns_cost").show().html(`${-Opportunity_Returns_cost}%`)
                        $reduction_returns_cost.html("").css({ padding: "0px" })

                    } else {
                        $reduction_returns_cost.html(`${-Opportunity_Returns_cost}%`).css({ padding: "10px 4px" })
                        $(".less_reduction_returns_cost").hide()

                    }
                } else {
                    reduction_returns_cost_graph.css({ visibility: 'hidden' })
                    increase_returns_cost_graph.css({ visibility: 'visible' })
                    if (graphPercent(Math.abs(Opportunity_Returns_cost), stepRoundNumber) < 25) {
                        $(".less_increase_returns_cost").show().html(`${-Opportunity_Returns_cost}%`)
                        $(".increase_returns_cost").html("").css({ padding: "0px", width: `${graphPercent(Math.abs(Opportunity_Returns_cost), stepRoundNumber)}%` })
                    } else {
                        $(".increase_returns_cost").html(`${-Opportunity_Returns_cost}%`).css({ padding: "10px 4px", width: `${graphPercent(Math.abs(Opportunity_Returns_cost), stepRoundNumber)}%` })
                        $(".less_increase_returns_cost").hide()
                    }
                }

                if (OpportunityOperatingProfit > 0) {
                    reduction_operating_graph.css({ visibility: 'hidden' })
                    increase_operating_graph.css({ visibility: 'visible' })
                    if (graphPercent(Math.abs(OpportunityOperatingProfit), stepRoundNumber) < 10) {
                        $(".less_increase_operating").show().html(`${OpportunityOperatingProfit}%`)
                        $increase_operating.html('').css({ padding: "0px" })

                    } else {
                        $increase_operating.html(`${OpportunityOperatingProfit}%`).css({ padding: "10px 4px" })
                        $(".less_increase_operating").hide()
                    }
                } else {
                    reduction_operating_graph.css({ visibility: 'visible' })
                    increase_operating_graph.css({ visibility: 'hidden' })
                    if (graphPercent(Math.abs(OpportunityOperatingProfit), stepRoundNumber) < 10) {
                        $(".less_reduction_operating").show().html(`${OpportunityOperatingProfit}%`)
                        $('.reduction_operating').html('').css({ padding: "0px", width: `${graphPercent(Math.abs(OpportunityOperatingProfit), stepRoundNumber)}%` })
                    } else {
                        $('.reduction_operating').html(`${OpportunityOperatingProfit}%`).css({ padding: "10px 4px", width: `${graphPercent(Math.abs(OpportunityOperatingProfit), stepRoundNumber)}%` })
                        $(".less_reduction_operating").hide()
                    }
                }

                returns_cost.html(`
                        <tr>
                           <td>Cost of Return Per Unit [${currency_type}]</td>
                           <td class="text-center">${formatNumber(Actual_result.toFixed(0), currency_type)}</td>
                           <td class="text-center">${formatNumber(Targeted_desired_result.toFixed(0), currency_type)}</td>
                        </tr>
                        <tr>
                           <td>Number of Fresh Sales to Recover Cost of One Return</td>
                           <td class="text-center">${Number_Actual_result.toFixed(0)}</td>
                           <td class="text-center">${Number_Targeted_desired_result.toFixed(0)}</td>
                        </tr>
                  `)
                returns_impact.html(`
                        <tr>
                           <td>Return Cost as % of Sales Revenue</td>
                           <td class="text-center">${return_cost_actual_result}%</td>
                           <td class="text-center">${return_cost_Targeted_desired_result}%</td>
                        </tr>
                        <tr>
                           <td>Return Cost as % of Operating Profit</td>
                           <td class="text-center">${operating_profit_Actual_result}%</td>
                           <td class="text-center">${operating_profit_Targeted_desired_result}%</td>
                        </tr>
         `)
                opportunity_table.html(
                    `
                        <tr>
                           <td>Reduction in Returns Cost</td>
                           <td class="text-center">${Opportunity_Returns_cost}%</td>
                        </tr>
                        <tr>
                           <td>Increase in Operating Profit</td>
                           <td class="text-center">${OpportunityOperatingProfit}%</td>
                        </tr>
                        <tr>
                           <td>Absolute Increase in Annual Operating Profit [${currency_type} ${['₹', "₨"].includes(currency_type) ? "CR" : ""}]</td>
                           <td class="text-center">${formatNumber(Opportunity_Operating_Profit_cr.toFixed(0), currency_type)}</td>
                        </tr>
            `
                )
                $("#loading").hide()
                $('#result-section').show()
                localStorage.setItem("returns_calculator_data", "true")

                $("html, body").animate({
                    scrollTop : $('#result-section').offset().top - 100
                }, 500)
                // localStorage.removeItem("returns_calculator")
            }
        }
        );
})

// intlTelInput(input, {
//     initialCountry: "auto",
//     separateDialCode: true,
//     geoIpLookup: function (success, failure) {
//         $.get("https://ipinfo.io", function () { }, "jsonp").always(function (resp) {
//             var countryCode = (resp && resp.country) ? resp.country : "us";
//             success(countryCode);
//         });
//     },
// });
