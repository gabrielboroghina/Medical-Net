const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./src/routes');


const app = express();

app.use(helmet());
app.use(morgan(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

app.use('/api/v1', routes);

/** Error handling middleware */
app.use((err, req, res, next) => {
    if (err.name === "JsonError") {
        console.log(err);
        res.status(err.httpStatus)
            .json(err.content);
    } else {
        console.trace(err);
        let status = 500;
        let message = 'Internal server error';
        if (err.httpStatus) {
            status = err.httpStatus;
            message = err.message;
        }
        res.status(status).json({
            error: message,
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`App is listening on ${process.env.PORT}`);
});
