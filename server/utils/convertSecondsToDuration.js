const convertSecondsToDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const parts = [];
    if (hours > 0) {
        parts.push(`${hours}hr`);
    }
    if (minutes > 0) {
        parts.push(`${minutes}min`);
    }

    return parts.length > 0 ? parts.join(' ') : '0min';
};

module.exports = convertSecondsToDuration;
