function numberDays (endDate) {
    const todayDate = new Date().getTime();
    const EndDateCampaign = new Date(endDate).getTime();
    const remainingDay = Math.floor((EndDateCampaign - todayDate) / (1000 * 60 * 60 * 24));

    return remainingDay
}

export default numberDays;