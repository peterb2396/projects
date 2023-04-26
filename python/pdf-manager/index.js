var axios = require('axios');
var FormData = require('form-data');
const jsonexport = require('jsonexport')
const fs = require('fs');
const sharp = require('sharp');
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const bodyParser = require('body-parser');

var data = new FormData();
data.append('input', fs.createReadStream('form.jpeg'));
data.append('dup_check', 'False');

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen('9000', () =>
    console.log(`Example app listening on port 9000`),
);

let dpi;
const upload = multer()
const t = 0.001
var config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://trigger.extracttable.com',
    headers: {
        // 'x-api-key': 'XID9FJGAzttnGDJaAWckW5enFqbm1SCYCmtgB51w',
        'x-api-key': 'S495tK4e27LtSIPK42xvVhw9YM12YSZWNNdezgcb',
        ...data.getHeaders()
    },
    data: data
};

const calculateDpi = async () => {
    await sharp('form.jpeg')
        .metadata()
        .then(metadata => {
            dpi = metadata.density ? metadata.density : 72; // assuming 72 DPI
        })
        .catch(err => console.log(err));
}

app.post('/extract', upload.single('file'), (req, res) => {
    let fields = JSON.parse(req.body.fields)
    calculateDpi().then(() => {
        // axios(config)
        //     .then(function (response) {
        const lines = [
            {
                "Line": "Home Inspection",
                "WordsArray": [
                    {
                        "Conf": 99.98,
                        "Loc": [
                            0.3644,
                            0.0223,
                            0.4529,
                            0.0409
                        ],
                        "Word": "Home"
                    },
                    {
                        "Conf": 99.68,
                        "Loc": [
                            0.4629,
                            0.0212,
                            0.6173,
                            0.0446
                        ],
                        "Word": "Inspection"
                    }
                ]
            },
            {
                "Line": "T",
                "WordsArray": [
                    {
                        "Conf": 97.6,
                        "Loc": [
                            0.8904,
                            0.0488,
                            0.9795,
                            0.0877
                        ],
                        "Word": "T"
                    }
                ]
            },
            {
                "Line": "Property Address:",
                "WordsArray": [
                    {
                        "Conf": 99.98,
                        "Loc": [
                            0.0352,
                            0.0902,
                            0.1357,
                            0.1095
                        ],
                        "Word": "Property"
                    },
                    {
                        "Conf": 99.97,
                        "Loc": [
                            0.1415,
                            0.0916,
                            0.2443,
                            0.1071
                        ],
                        "Word": "Address:"
                    }
                ]
            },
            {
                "Line": "11 Hay Ln",
                "WordsArray": [
                    {
                        "Conf": 95.77,
                        "Loc": [
                            0.2622,
                            0.0932,
                            0.2868,
                            0.1145
                        ],
                        "Word": "11"
                    },
                    {
                        "Conf": 99.85,
                        "Loc": [
                            0.325,
                            0.0944,
                            0.4002,
                            0.1225
                        ],
                        "Word": "Hay"
                    },
                    {
                        "Conf": 99.88,
                        "Loc": [
                            0.4418,
                            0.0938,
                            0.4848,
                            0.1122
                        ],
                        "Word": "Ln"
                    }
                ]
            },
            {
                "Line": "Inspection Date:",
                "WordsArray": [
                    {
                        "Conf": 99.7,
                        "Loc": [
                            0.0366,
                            0.1221,
                            0.1587,
                            0.1405
                        ],
                        "Word": "Inspection"
                    },
                    {
                        "Conf": 99.91,
                        "Loc": [
                            0.1665,
                            0.1232,
                            0.2293,
                            0.1384
                        ],
                        "Word": "Date:"
                    }
                ]
            },
            {
                "Line": "12/18/2022",
                "WordsArray": [
                    {
                        "Conf": 99.38,
                        "Loc": [
                            0.2685,
                            0.1197,
                            0.4989,
                            0.1465
                        ],
                        "Word": "12/18/2022"
                    }
                ]
            },
            {
                "Line": "Inspector:",
                "WordsArray": [
                    {
                        "Conf": 97.85,
                        "Loc": [
                            0.0363,
                            0.1544,
                            0.153,
                            0.1726
                        ],
                        "Word": "Inspector:"
                    }
                ]
            },
            {
                "Line": "Mike Hamilton",
                "WordsArray": [
                    {
                        "Conf": 99.29,
                        "Loc": [
                            0.2664,
                            0.1553,
                            0.3696,
                            0.1773
                        ],
                        "Word": "Mike"
                    },
                    {
                        "Conf": 99.95,
                        "Loc": [
                            0.4027,
                            0.1539,
                            0.5793,
                            0.1769
                        ],
                        "Word": "Hamilton"
                    }
                ]
            },
            {
                "Line": "Client Details",
                "WordsArray": [
                    {
                        "Conf": 99.89,
                        "Loc": [
                            0.0385,
                            0.206,
                            0.1254,
                            0.2248
                        ],
                        "Word": "Client"
                    },
                    {
                        "Conf": 99.97,
                        "Loc": [
                            0.1358,
                            0.2064,
                            0.2391,
                            0.225
                        ],
                        "Word": "Details"
                    }
                ]
            },
            {
                "Line": "Name:",
                "WordsArray": [
                    {
                        "Conf": 99.94,
                        "Loc": [
                            0.0378,
                            0.2424,
                            0.1143,
                            0.2572
                        ],
                        "Word": "Name:"
                    }
                ]
            },
            {
                "Line": "Carlos Amana",
                "WordsArray": [
                    {
                        "Conf": 90.55,
                        "Loc": [
                            0.1616,
                            0.2409,
                            0.2876,
                            0.2611
                        ],
                        "Word": "Carlos"
                    },
                    {
                        "Conf": 99.94,
                        "Loc": [
                            0.3214,
                            0.2418,
                            0.442,
                            0.2603
                        ],
                        "Word": "Amana"
                    }
                ]
            },
            {
                "Line": "Phone:",
                "WordsArray": [
                    {
                        "Conf": 99.9,
                        "Loc": [
                            0.5858,
                            0.239,
                            0.6665,
                            0.2542
                        ],
                        "Word": "Phone:"
                    }
                ]
            },
            {
                "Line": "555-294-3398",
                "WordsArray": [
                    {
                        "Conf": 94.13,
                        "Loc": [
                            0.6767,
                            0.2362,
                            0.9,
                            0.2551
                        ],
                        "Word": "555-294-3398"
                    }
                ]
            },
            {
                "Line": "Address:",
                "WordsArray": [
                    {
                        "Conf": 99.96,
                        "Loc": [
                            0.0361,
                            0.2679,
                            0.1391,
                            0.2832
                        ],
                        "Word": "Address:"
                    }
                ]
            },
            {
                "Line": "1087 Express Drive N",
                "WordsArray": [
                    {
                        "Conf": 99.94,
                        "Loc": [
                            0.157,
                            0.2689,
                            0.2277,
                            0.287
                        ],
                        "Word": "1087"
                    },
                    {
                        "Conf": 99.94,
                        "Loc": [
                            0.2524,
                            0.267,
                            0.3893,
                            0.288
                        ],
                        "Word": "Express"
                    },
                    {
                        "Conf": 99.96,
                        "Loc": [
                            0.4133,
                            0.2643,
                            0.5029,
                            0.2836
                        ],
                        "Word": "Drive"
                    },
                    {
                        "Conf": 99.97,
                        "Loc": [
                            0.5294,
                            0.2652,
                            0.5558,
                            0.2819
                        ],
                        "Word": "N"
                    }
                ]
            },
            {
                "Line": "Reported Issues",
                "WordsArray": [
                    {
                        "Conf": 99.98,
                        "Loc": [
                            0.0399,
                            0.3112,
                            0.1757,
                            0.3335
                        ],
                        "Word": "Reported"
                    },
                    {
                        "Conf": 99.59,
                        "Loc": [
                            0.1878,
                            0.3118,
                            0.2793,
                            0.3296
                        ],
                        "Word": "Issues"
                    }
                ]
            },
            {
                "Line": "Mold",
                "WordsArray": [
                    {
                        "Conf": 99.93,
                        "Loc": [
                            0.046,
                            0.3551,
                            0.1022,
                            0.3698
                        ],
                        "Word": "Mold"
                    }
                ]
            },
            {
                "Line": "Primary bathroom has black mold",
                "WordsArray": [
                    {
                        "Conf": 99.79,
                        "Loc": [
                            0.2192,
                            0.3517,
                            0.3654,
                            0.3799
                        ],
                        "Word": "Primary"
                    },
                    {
                        "Conf": 99.89,
                        "Loc": [
                            0.3901,
                            0.3504,
                            0.5597,
                            0.3698
                        ],
                        "Word": "bathroom"
                    },
                    {
                        "Conf": 99.99,
                        "Loc": [
                            0.5793,
                            0.3487,
                            0.6342,
                            0.3659
                        ],
                        "Word": "has"
                    },
                    {
                        "Conf": 99.57,
                        "Loc": [
                            0.6544,
                            0.3469,
                            0.7413,
                            0.3662
                        ],
                        "Word": "black"
                    },
                    {
                        "Conf": 99.69,
                        "Loc": [
                            0.7635,
                            0.3489,
                            0.8464,
                            0.3659
                        ],
                        "Word": "mold"
                    }
                ]
            },
            {
                "Line": "behind the sink. Requires complete",
                "WordsArray": [
                    {
                        "Conf": 99.91,
                        "Loc": [
                            0.2216,
                            0.3762,
                            0.3417,
                            0.3955
                        ],
                        "Word": "behind"
                    },
                    {
                        "Conf": 100,
                        "Loc": [
                            0.37,
                            0.3772,
                            0.4353,
                            0.3939
                        ],
                        "Word": "the"
                    },
                    {
                        "Conf": 78.39,
                        "Loc": [
                            0.4589,
                            0.3749,
                            0.5372,
                            0.3933
                        ],
                        "Word": "sink."
                    },
                    {
                        "Conf": 99.85,
                        "Loc": [
                            0.549,
                            0.3714,
                            0.6865,
                            0.3995
                        ],
                        "Word": "Requires"
                    },
                    {
                        "Conf": 82.01,
                        "Loc": [
                            0.7184,
                            0.375,
                            0.8691,
                            0.3968
                        ],
                        "Word": "complete"
                    }
                ]
            },
            {
                "Line": "remodel",
                "WordsArray": [
                    {
                        "Conf": 84.97,
                        "Loc": [
                            0.2217,
                            0.4002,
                            0.3602,
                            0.4153
                        ],
                        "Word": "remodel"
                    }
                ]
            },
            {
                "Line": "Framing",
                "WordsArray": [
                    {
                        "Conf": 99.81,
                        "Loc": [
                            0.0448,
                            0.4286,
                            0.1392,
                            0.4466
                        ],
                        "Word": "Framing"
                    }
                ]
            },
            {
                "Line": "Electrical",
                "WordsArray": [
                    {
                        "Conf": 99.79,
                        "Loc": [
                            0.0454,
                            0.5302,
                            0.1525,
                            0.5452
                        ],
                        "Word": "Electrical"
                    }
                ]
            },
            {
                "Line": "Wiring is old and ungrounded,",
                "WordsArray": [
                    {
                        "Conf": 94.58,
                        "Loc": [
                            0.2177,
                            0.5251,
                            0.3332,
                            0.5566
                        ],
                        "Word": "Wiring"
                    },
                    {
                        "Conf": 99.99,
                        "Loc": [
                            0.3656,
                            0.5249,
                            0.4007,
                            0.5461
                        ],
                        "Word": "is"
                    },
                    {
                        "Conf": 99.79,
                        "Loc": [
                            0.4326,
                            0.5263,
                            0.4891,
                            0.5449
                        ],
                        "Word": "old"
                    },
                    {
                        "Conf": 100,
                        "Loc": [
                            0.5157,
                            0.5215,
                            0.5809,
                            0.5427
                        ],
                        "Word": "and"
                    },
                    {
                        "Conf": 97.21,
                        "Loc": [
                            0.6065,
                            0.5241,
                            0.8376,
                            0.55
                        ],
                        "Word": "ungrounded,"
                    }
                ]
            },
            {
                "Line": "should rewire entire home",
                "WordsArray": [
                    {
                        "Conf": 99.26,
                        "Loc": [
                            0.2288,
                            0.5578,
                            0.3484,
                            0.5764
                        ],
                        "Word": "should"
                    },
                    {
                        "Conf": 99.71,
                        "Loc": [
                            0.3795,
                            0.5531,
                            0.5094,
                            0.5744
                        ],
                        "Word": "rewire"
                    },
                    {
                        "Conf": 99.97,
                        "Loc": [
                            0.5418,
                            0.5481,
                            0.6653,
                            0.5725
                        ],
                        "Word": "entire"
                    },
                    {
                        "Conf": 99.96,
                        "Loc": [
                            0.6979,
                            0.5497,
                            0.8,
                            0.5692
                        ],
                        "Word": "home"
                    }
                ]
            },
            {
                "Line": "Plumbing",
                "WordsArray": [
                    {
                        "Conf": 99.8,
                        "Loc": [
                            0.046,
                            0.6318,
                            0.1561,
                            0.6494
                        ],
                        "Word": "Plumbing"
                    }
                ]
            },
            {
                "Line": "Roof",
                "WordsArray": [
                    {
                        "Conf": 99.92,
                        "Loc": [
                            0.0474,
                            0.7322,
                            0.101,
                            0.7473
                        ],
                        "Word": "Roof"
                    }
                ]
            },
            {
                "Line": "Foundation",
                "WordsArray": [
                    {
                        "Conf": 99.96,
                        "Loc": [
                            0.0444,
                            0.8332,
                            0.1747,
                            0.8489
                        ],
                        "Word": "Foundation"
                    }
                ]
            },
            {
                "Line": "HVAC",
                "WordsArray": [
                    {
                        "Conf": 99.91,
                        "Loc": [
                            0.0435,
                            0.9255,
                            0.1079,
                            0.9401
                        ],
                        "Word": "HVAC"
                    }
                ]
            }
        ]
        Object.keys(fields).map((key) => {
            const rect = fields[key].rect
            const pageHeight = fields[key].pageHeight
            const pageWidth = fields[key].pageWidth
            x1 = ((rect[0] / 72) * dpi) / pageWidth
            h = ((Math.abs(((rect[1] / 72) * dpi) - ((rect[3] / 72) * dpi)))) / pageHeight
            y2 = ((((pageHeight - rect[1]) / 72) * dpi) - h) / pageHeight
            x2 = ((rect[2] / 72) * dpi) / pageWidth
            y1 = y2 - h
            let result = ''
            lines.map((line) => {
                line.WordsArray.map((word) => {
                    const loc = word.Loc

                    // if (fields[key].name === 'Date' && word.Word === "12/18/2022") console.log(x1, loc[0] - t , loc[0] + t , x2 , y1 , loc[1] + t , loc[1] - t , y2, fields[key].name)

                    if (x1 <= loc[0] + t && loc[0] - t <= x2 && y1 <= loc[1] + t && loc[1] - t <= y2) {
                        result += ' ' + word.Word
                    }
                })
            })
            fields = {
                ...fields, [key]: {
                    ...fields[key],
                    value: result
                }
            }
            console.log(result)
        })
        res.send(fields)
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
    })
})


// axios(config)
//     .then(function (response) {
//         console.log(response.data.Lines[0].LinesArray);
//         const res = response.data.Tables[0].TableJson
//         const obj = []
//         Object.keys(res).map((key) => {
//             obj.push(res[key])
//         })
//         fs.writeFile('data.json', JSON.stringify(obj), 'utf8', () => { });
//         var reader = fs.createReadStream('data.json');
//         var writer = fs.createWriteStream('out.csv');

//         reader.pipe(jsonexport()).pipe(writer);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });
