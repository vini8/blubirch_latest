function getApiUrl(apiName) {
    // Add more API URLs as needed
    const apiUrls = {
        RETURNS_CALCULATOR: 'https://qa-docker.blubirch.com:3064/returns_calculator',
        CATEGORIES_LIST: "https://qa-docker.blubirch.com:3064/returns_calculator/categories_list",
        SELF_ASSESSMENT: 'https://qa-docker.blubirch.com:3064/assessments.json',
        ASSESSMENT_RESULTS_ID_JSON: 'https://qa-docker.blubirch.com:3064/assessment_results',
    };

    return apiUrls[apiName] || null;
}
