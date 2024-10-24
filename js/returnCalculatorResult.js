
// const returnTabs1 = JSON.parse(localStorage.getItem("is_data_submit"))

// console.log("returnTabs new",returnTabs)
console.log("returnTabs new",returnTabs)
if (returnTabs === true) {
    console.log('New file con--------------')

    function handleBackToForm(e) {
        console.log("handleBackToForm88888", e)
    }

    $('.required').on('input', function () {
        // var activeStep = $(this).closest('#returns_impact_calculator-result');
        var inputs = $('.required');
        var allFieldsFilled = true;
        var nextButton = $('.submit-generate-results');
        // if()
        // if (nextButton.length === 0) {
        //    nextButton = activeStep.find('.submit-generate-results')
        // }

        inputs.each(function () {

            var inputValue = $(this).val().trim();
            if (inputValue === '') {
                allFieldsFilled = false;
                return false; // Exit the loop early
            } else {
                allFieldsFilled = true;
            }
            // }

        });

        if (inputs.hasClass('invalid')) {
            allFieldsFilled = false;
        }
        nextButton.addClass(!allFieldsFilled ? 'next-sbtn' : 'next-enabled px-3');
        nextButton.removeClass(allFieldsFilled ? 'next-sbtn' : 'next-enabled px-3');
        nextButton.prop('disabled', !allFieldsFilled);
    });
    function handlePreviousPageRecheck() {
        event.preventDefault();
        localStorage.removeItem("returns_calculator")
        localStorage.removeItem("returns_calculator_data")
        window.history.back(-1);
        // javascript:history.go(-1)
        // return false 
    }
    function handlePreviousPage(event) {
        event.preventDefault();
        console.log("Privous----------", event);
        // localStorage.removeItem("returns_calculator")
        // localStorage.removeItem("returns_calculator_data")
        // // window.history.back(-1);
        // javascript: history.go(-1)
        // return false
    }

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

    $('.submit-generate-results').on('click', function () {
        $(this).prop('disabled', true);

        var actual_values_inputs = $('#actual_values')
        var targeted_values_inputs = $('#targeted_values')

        let actual_values = {}
        let targeted_values = {}
        let returns_calculator = JSON.parse(localStorage.getItem("returns_calculator"))
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
        returns_calculator.asset_inputs['actual_values'] = actual_values
        returns_calculator.asset_inputs['targeted_values'] = targeted_values
        let returns_cost = $("#returns_cost")
        let returns_impact = $("#returns_impact")
        let opportunity_table = $('#opportunity')
        let return_unit = $("#return-unit")
        let userName = $("#userName")
        $("#loading").show()
        $('#result-section').hide()


        fetch('https://qa-docker.blubirch.com:3064/returns_calculator', {
            method: "POST",
            body: JSON.stringify({ returns_calculator }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    $('#result-section').show()
                    $('#download-report').prop('disabled', false);
                    let currency_type = returns_calculator.currency

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
                    console.log(steps, "::: steps");
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
                    userName.html(returns_calculator.name)
                    return_unit_perecent.html(`${formatNumber(GenerateResultInPercent, currency_type)}%`)
                    actual_cost_one_return.html(Number_Actual_result.toFixed(0))
                    targeted_cost_one_return.html(Number_Targeted_desired_result.toFixed(0))
                    impact_cost_sales_revenue.html(`${return_cost_actual_result}%`)
                    targeted_cost_sales_revenue.html(`${return_cost_Targeted_desired_result}%`)
                    impact_cost_operating_profit.html(`${operating_profit_Actual_result}%`)
                    impact_targeted_cost_operating_profit.html(`${operating_profit_Targeted_desired_result}%`)
                    opportunity_returns_cost.html(`${Opportunity_Returns_cost}%`)

                    remaining_actual_targeted.html(`[${formatNumber(Actual_result - Targeted_desired_result)} ${currency_type}]`)
                    opportunity_operating_profit.html(`${OpportunityOperatingProfit}%`)
                    opportunity_annual_operating_profit.html(`${formatNumber(Opportunity_Operating_Profit_cr)} ${currency_type} ${['₹', "₨"].includes(currency_type) ? "CR" : ""}`)
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
                    // return_unit.html(
                    // `
                    // <li class="pb-1">
                    //    You can reduce the cost of return/unit by <strong>${formatNumber(GenerateResultInPercent , currency_type)}% [${formatNumber((Actual_result - Targeted_desired_result) , currency_type)} ${currency_type}]  </strong> 
                    // </li>
                    // <li class="pb-1">
                    //    Every single returned unit eats away the profit generated by multiple fresh units, the number of
                    //    fresh
                    //    sales to be made to recover the cost of one returned unit is <strong>${Number_Actual_result}</strong> and can be reduced to <strong>${Number_Targeted_desired_result}</strong>.
                    // </li>
                    // <li class="pb-1">
                    //    Your returns have a negative impact on your sales revenue, your returns cost accounts for <strong>${return_cost_actual_result}%</strong> of
                    //    your
                    //    sales revenue and can be reduced to <strong>${return_cost_Targeted_desired_result}%</strong>
                    // </li>
                    // <li class="pb-1">
                    //    Your returns impact your operating profit amounting to <strong>${operating_profit_Actual_result}%</strong> of your operating profit and this can
                    //    be
                    //    reduced to <strong>${operating_profit_Targeted_desired_result}%</strong>
                    // </li>
                    // <li class="pb-1">
                    //    By optimising your returns and the cost associated with them, you can unlock opportunities like a
                    //    reduction in returns cost by <strong>${Opportunity_Returns_cost}%</strong>, an increase in operating profits by <strong>${OpportunityOperatingProfit}%</strong> and an increase in
                    //    annual
                    //    profit by <strong>${Opportunity_Operating_Profit_cr} ${currency_type} CR<strong>
                    // </li>
                    // `
                    // )


                    returns_cost.html(`
                   <tr>
                      <td>Cost of Return Per Unit[${currency_type}]</td>
                      <td class="text-center">${formatNumber(Actual_result, currency_type)}</td>
                      <td class="text-center">${formatNumber(Targeted_desired_result, currency_type)}</td>
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
                      <td class="text-center">${formatNumber(Opportunity_Operating_Profit_cr)}</td>
                   </tr>
       `
                    )
                    $("#loading").hide()
                    $('#result-section').show()
                    localStorage.setItem("returns_calculator_data", "true")
                    // localStorage.removeItem("returns_calculator")
                }
            }
            );
    })

    $(document).ready(function () {
        let returns_calculator_data = JSON.parse(localStorage.getItem('returns_calculator_data'))
        if (returns_calculator_data) {
            localStorage.removeItem("returns_calculator")
            localStorage.removeItem("returns_calculator_data")
            // location.href = window.location.origin + '/returns-impact-calculator.html'
            handleTabToggle('back')
        }
        $('#result-section').hide()
        $("#loading").hide()

        $('#download-report').prop('disabled', true);
    })

    function handleTabToggle(param) {
        if (param === 'submit') {
            $("#business_form_inner").hide();
            $("#returns_impact_calculator-result").show();
        } else {
            $("#business_form_inner").show();
            $("#returns_impact_calculator-result").hide();
        }
    }

}