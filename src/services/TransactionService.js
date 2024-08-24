import axios from "axios";
import RequestHeaderCreationService from "./RequestHeaderCreationService";

export const transactionService = async (transactionInformation) => {
    return await axios.post("http://localhost:8081/api/transaction/transact", transactionInformation, RequestHeaderCreationService());
}

export const viewTransactionStatementsService = async (transactionInformation) => {
    return await axios.post("http://localhost:8081/api/transaction/viewstatement", transactionInformation, RequestHeaderCreationService());
}