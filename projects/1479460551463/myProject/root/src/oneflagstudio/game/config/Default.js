// Default saved structure
exports =  {
        firstAccess : true,
        sound: false,
        music: false,
        ___: { pin : '1234' , active : false}, // parental pin set for friendly child safety purchases
        energy: {current: 100, max: 100},
        tips: 100,
        crunchies: 9999,
        currentStage: 0,
        showAds : true,
        counter: {
            full: -1,
            nextTimer: 45000,
            next: -1,
//            multiplier  : [40, 75] 
        },
        catalog: {
            "energy" : [
                {
                    cost    : 200,
                    value   : 550,
                    type : "energy",
                    currency : "crunchy"
                },
                {
                    cost    : 100,
                    value   : 250,
                    type : "energy",
                    currency : "crunchy"
                },
                {
                    cost    : 60,
                    value   : 120,
                    type : "energy",
                    currency : "crunchy"
                },
                {
                    cost    : 30,
                    value   : 50,
                    type : "energy",
                    currency : "crunchy"
                }
            ],
            "tips" : [
                {
                    cost    : 200,
                    value   : 30,
                    type : "tips",
                    currency : "crunchy"
                },
                {
                    cost    : 140,
                    value   : 20,
                    type : "tips",
                    currency : "crunchy"
                },
                {
                    cost    : 80,
                    value   : 10,
                    type : "tips",
                    currency : "crunchy"
                },
                {
                    cost    : 50,
                    value   : 5,
                    type : "tips",
                    currency : "crunchy"
                }
            ],
            "crunchies" : [
                {
                    cost    : 999,
                    value   : 1000,
                    type : "crunchies",
                    currency : "euro",
                    itemDescription : "milCrunchies"
                },
                {
                    cost    : 499,
                    value   : 400,
                    type : "crunchies",
                    currency : "euro",
                    itemDescription : "quatrocentosCrunchies"
                },
                {
                    cost    : 249,
                    value   : 180,
                    type : "crunchies",
                    currency : "euro",
                    itemDescription : "centoOitentaCrunchies"
                },
                {
                    cost    : 099,
                    value   : 50,
                    type : "crunchies",
                    currency : "euro",
                    itemDescription : "cinquentaCrunchies"
                }
            ]
        },
        levels : [
            // 1
            { time : 0, stars : 0, locked : false , cost: 18},
            { time : 0, stars : 0, locked : true , cost: 24},
            { time : 0, stars : 0, locked : true , cost: 24},
            { time : 0, stars : 0, locked : true , cost: 24},
            { time : 0, stars : 0, locked : true , cost: 24},
            { time : 0, stars : 0, locked : true , cost: 24},
            { time : 0, stars : 0, locked : true , cost: 24},
            { time : 0, stars : 0, locked : true , cost: 24},
            { time : 0, stars : 0, locked : true , cost: 24},
            { time : 0, stars : 0, locked : true , cost: 42},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 3, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            // 2
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            // 3
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            // 4
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            // 5
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            // 6
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            // 7
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            // 8
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            // 9
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25},
            { time : 0, stars : 0, locked : true , cost: 25}
        ]
    };


