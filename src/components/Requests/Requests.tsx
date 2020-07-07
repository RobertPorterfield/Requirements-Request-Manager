import React from "react";
import { Button, Container, Table, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IRequirementsRequestCRUD } from "../../api/DomainObjects";

export interface IRequestsProps {
    requests: IRequirementsRequestCRUD[]
}

export const Requests: React.FunctionComponent<IRequestsProps> = (props) => {

    return (
        <Container fluid="md" className="pb-5 pt-3">
            <h1>Requests</h1>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Requester</th>
                        <th>Request Date</th>
                        <th>Requirement Type</th>
                        <th>Application Needed</th>
                        <th>Org Priority</th>
                        <th>Operational Need Date</th>
                    </tr>
                </thead>
                {props.requests.map(request =>
                    <Accordion as='tbody' key={request.Id}>
                        <Accordion.Toggle eventKey="0" as='tr'>
                            <td>{request.Title}</td>
                            <td>{request.Requester.Title}</td>
                            <td>{request.RequestDate.format("DD MMM YYYY")}</td>
                            <td>{request.RequirementType}</td>
                            <td>{request.ApplicationNeeded}</td>
                            <td>{request.OrgPriority}</td>
                            <td>{request.OperationalNeedDate.format("DD MMM YYYY")}</td>
                        </Accordion.Toggle>
                        <tr>
                            {/* padding set to 0 to "fully" collapse the TD */}
                            <td colSpan={7} style={{ padding: 0 }}>
                                <Accordion.Collapse eventKey="0">
                                   {/* add padding back in to collapsed element */}
                                    <div style={{ padding: ".75rem" }}>
                                        {/* Add your collapsed content in here */}
                                        Inside the collapse asdff asdf asdfas fasdf asd fasd fasdf asd f
                                    </div>
                                </Accordion.Collapse>
                            </td>
                        </tr>
                    </Accordion>
                )}
            </Table>
            <Link to="/Requests/new">
                <Button variant="primary" className="float-left">New Request</Button>
            </Link>
        </Container>
    );
}