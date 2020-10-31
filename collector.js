const googleTrends = require('google-trends-api');
const fs = require('fs');

/*
From GoogleTrendApi-GitHub | https://github.com/pat310/google-trends-api

    googleTrends.dailyTrends({ geo: string }, cbFunc)

    Requires an object as the first parameter with the following keys:

    geo - required - type string - geocode for a country. For example, geo: 'US' will target United States or geo: 'FR' will target France.
    hl - optional - type string - preferred language code for results (defaults to english).
    timezone - optional - type number - preferred timezone (defaults to the time zone difference, in minutes, from UTC to current locale (host system settings))
    trendDate - optional - type Date object - the date you are interesting in retrieving trends information for (defaults to the current date). Note that querying for a date more than 15 days in the past will result in an error.
    Optional callback function as the second parameter (otherwise returns a promise)

Put in config the targeted country, a start date and an end date. It will create files in "./results" that contains daily trends data.
*/
var config={
    geo:'US',
    start:'2020-10-20',
    end:'2020-10-30'
}//End-Start<15 

async function main(){
    targetDate = new Date(Date.parse(config.start));
    endDate = new Date(Date.parse(config.end));

    while(targetDate<=endDate){
        await analizeTrends({
            trendDate: targetDate,
            geo: config.geo,
        });
        targetDate.setDate(targetDate.getDate()+1);
    }
}

async function analizeTrends(dayConfig){
    await googleTrends.dailyTrends(dayConfig, function(err, results) {
        if (err) {
          console.log(err);
        }else{
            var stringify = JSON.parse(results);
            var date = stringify.default.trendingSearchesDays[0].date;
            var trend = [];
            stringify.default.trendingSearchesDays[0].trendingSearches.forEach(element => {
                trend.push({
                    title: element.title.query,
                    formattedTraffic: element.formattedTraffic,
                    newsUrl: element.image.newsUrl,
                    imageUrl: element.image.imageUrl
                });
            });
            fs.writeFileSync("./results/"+date+".json", JSON.stringify(trend));
        }
      });//refresh ~ 12h France
      console.log(dayConfig+" : Collected");
}

main();