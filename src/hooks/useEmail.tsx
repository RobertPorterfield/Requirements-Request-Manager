import { useState } from "react";
import { ApplicationTypes, IRequirementsRequestCRUD } from "../api/DomainObjects";
import { EmailApiConfig } from "../api/EmailApi";
import { InternalError } from "../api/InternalErrors";
import { INote } from "../api/NotesApi";
import { RoleType } from "../api/RolesApi";
import { IPerson } from "../api/UserApi";
import { useRoles } from "./useRoles";

declare var _spPageContextInfo: any;

export interface IEmailSender {
    sending: boolean,
    error: string,
    clearError: () => void,
    sendEmail: (to: IPerson[], subject: string, body: string, cc?: IPerson[], from?: IPerson) => Promise<void>,
    sendSubmitEmail: (request: IRequirementsRequestCRUD) => Promise<void>,
    sendApprovalEmail: (request: IRequirementsRequestCRUD) => Promise<void>,
    sendNoteEmail: (request: IRequirementsRequestCRUD, note: INote) => Promise<void>
}

export function useEmail(): IEmailSender {

    const [sending, setSending] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const roles = useRoles();

    const emailApi = EmailApiConfig.getApi();

    const clearError = () => setError("");

    const getManagers = (): IPerson[] => {
        return roles.roles
            .filter(role => role.Roles
                .some(r => r.Role === RoleType.MANAGER))
            .map(role => role.User);
    }

    const sendEmail = async (to: IPerson[], subject: string, body: string, cc?: IPerson[], from?: IPerson): Promise<void> => {
        try {
            setSending(true);
            if (to.length) {
                await emailApi.sendEmail(to, subject, body, cc, from);
            }
        } catch (e) {
            let message = `Error trying to send Email to ${to} with subject ${subject} and body ${body}`;
            console.error(message);
            console.error(e);
            if (e instanceof InternalError) {
                setError(e.message);
                throw e;
            } else if (e instanceof Error) {
                message = message += ` with error message ${e.message}`;
                setError(message);
                throw new InternalError(e, message);
            } else if (typeof (e) === "string") {
                message += ` with error message ${e}`;
                setError(message);
                throw new InternalError(new Error(e), message);
            } else {
                message += ` with error message ${e.message}`;
                setError(message);
                throw new InternalError(new Error(message));
            }
        } finally {
            setSending(false);
        }
    }

    const sendSubmitEmail = async (request: IRequirementsRequestCRUD): Promise<void> => {
        let to = [request.ApprovingPEO];
        let subject = `Request ${request.getFormattedId()} Submitted`;
        let body = `Hello, a requirements request has been submitted for which you are the approving official by ${request.Requester.Title}.
            
            To review/approve the request, please click <a href="${_spPageContextInfo.webAbsoluteUrl}/index.aspx#/Requests/Review/${request.Id}">here</a>.`;
        let cc = getManagers();

        return sendEmail(to, subject, body, cc);
    }

    const sendApprovalEmail = async (request: IRequirementsRequestCRUD): Promise<void> => {
        let to = getManagers();
        if (request.ApprovingPEO.Id !== request.Requester.Id) {
            to.push(request.Requester);
        }
        let subject = `Request ${request.getFormattedId()} Approved`;
        let body = `Hello, requirements request ${request.getFormattedId()} for ${request.ApplicationNeeded !== ApplicationTypes.OTHER ? request.ApplicationNeeded : request.OtherApplicationNeeded} has been approved by the approving official ${request.ApprovingPEO.Title}.
        ${request.PEOApprovedComment ? `The approver left a comment saying "${request.PEOApprovedComment}"` : ''}
        
        To view the request and any comments/modifications left by the approver, please click <a href="${_spPageContextInfo.webAbsoluteUrl}/index.aspx#/Requests/View/${request.Id}">here</a>.`;

        return sendEmail(to, subject, body);
    }

    const sendNoteEmail = async (request: IRequirementsRequestCRUD, note: INote): Promise<void> => {
        let to = [request.ApprovingPEO, request.Requester];
        let subject = `Note Added for Request ${request.getFormattedId()}`;
        let body = `Hello, a note has been added to your requirements request ${request.Title}

            The note is:
            <h4>${note.Title}</h4><p>"${note.Text}"</p>
            
            To review the request/note, please click <a href="${_spPageContextInfo.webAbsoluteUrl}/index.aspx#/Requests/Review/${request.Id}">here</a>.`;

        return sendEmail(to, subject, body);
    }

    return {
        sending,
        error,
        clearError,
        sendEmail,
        sendSubmitEmail,
        sendApprovalEmail,
        sendNoteEmail
    }
}