import errorHandler from "errorhandler";
import {expressServer, prepare} from "./app";

// DO NOT USE THIS IN PRODUCTION
expressServer.use(errorHandler());

prepare();