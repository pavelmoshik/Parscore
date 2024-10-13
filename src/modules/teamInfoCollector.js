import axios from 'axios';
import { HEADERS, buildApiUrl, isCollectorLeagueAllowed, TEAM_COLLECTOR_OUTPUT_FILE } from '../config.js';
import { parseDataToArray } from './dataStructurizer.js';
import { saveToFileAsync } from '../fileManager.js';

export const fetchAllMatchData = async (structuredData) => {
    if (!structuredData || Object.keys(structuredData).length === 0) {
        console.log("Нет входящих данных для обработки.");
        return null;
    }

    const staticPart = 'df_hh_1_';
    const allMatchData = [];

    const allMatchIds = Object.entries(structuredData)
        .flatMap(([_, [leagueInfo, matches]]) =>
            isCollectorLeagueAllowed(leagueInfo.ZC)
                ? matches.map(match => ({ matchId: match['~AA'], leagueZC: leagueInfo.ZC }))
                : []
        );

    if (allMatchIds.length === 0) {
        console.log("Нет матчей для обработки.");
        return null;
    }

    const fetchMatchDataPromises = allMatchIds.map(async ({ matchId, leagueZC }) => {
        try {
            const dynamicPart = `${staticPart}${matchId}`;
            const apiUrl = buildApiUrl(dynamicPart);
            const response = await axios.get(apiUrl, { headers: HEADERS });
            return { data: response.data, leagueZC };
        } catch (error) {
            console.error(`Ошибка при получении данных для матча ${matchId}: ${error.message}`);
            return null;
        }
    });

    const matchDataResults = await Promise.allSettled(fetchMatchDataPromises);
    matchDataResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
            allMatchData.push(result.value.data);
        }
    });

    if (allMatchData.length > 0) {
        const rawData = allMatchData.join('~');
        const parsedResult = parseDataToArray(rawData, allMatchIds);

        try {
            await saveToFileAsync(parsedResult, TEAM_COLLECTOR_OUTPUT_FILE);
            console.log('Данные успешно сохранены.');
            return parsedResult;
        } catch (error) {
            console.error('Ошибка при сохранении файла:', error.message);
        }
    }

    return null;
};
