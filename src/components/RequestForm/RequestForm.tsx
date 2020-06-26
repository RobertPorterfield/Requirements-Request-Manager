import React, { useState } from "react";
import { Col, Container, Form } from "react-bootstrap";
import { ApplicationTypes, Centers, IRequirementsRequestCRUD, RequirementsRequest, RequirementTypes, OrgPriorities } from "../../api/DomainObjects";
import { PeoplePicker, SPPersona } from "../PeoplePicker/PeoplePicker";
import './RequestForm.css';
import { CustomInputeDatePicker } from "../CustomInputDatePicker/CustomInputDatePicker";

export const RequestForm: React.FunctionComponent<any> = (props) => {

    const [request, setRequest] = useState<IRequirementsRequestCRUD>(new RequirementsRequest());
    const [showFundingField, setShowFundingField] = useState<boolean>(false);

    const updateRequest = (fieldUpdating: string, newValue: any): void => {
        setRequest({ ...request, [fieldUpdating]: newValue });
    }

    const flipShowFundingField = (): void => {
        setShowFundingField(!showFundingField);
    }

    return (
        <Container className="pb-5 pt-3">
            <h1>New Request</h1>
            <Form className="request-form m-3">
                <Form.Row>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label lg="4" sm="6">Requester Org Symbol</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your Org Symbol"
                            value={request.RequesterOrgSymbol}
                            onChange={e => updateRequest('RequesterOrgSymbol', e.target.value)}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label lg="4" sm="6">Requester DSN #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your DSN Phone Number"
                            value={request.RequesterDSNPhone}
                            onChange={e => updateRequest('RequesterDSNPhone', e.target.value)}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label lg="4" sm="6">Requester Comm #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Your Commercial Phone Number"
                            value={request.RequesterCommPhone}
                            onChange={e => updateRequest('RequesterCommPhone', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="6" lg="6" md="8" sm="12" xs="12">
                        <Form.Label>2 Ltr/PEO to Approve:</Form.Label>
                        <Form.Control
                            as={PeoplePicker}
                            updatePeople={(p: SPPersona[]) => {
                                let persona = p[0];
                                updateRequest('ApprovingPEO', { Id: persona.SPUserId, Title: persona.text, Email: persona.Email });
                            }}
                            readOnly={false}
                            required={true}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="4" sm="6" xs="12">
                        <Form.Label>PEO Org Symbol</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approving PEO's Org Symbol"
                            value={request.PEOOrgSymbol}
                            onChange={e => updateRequest('PEOOrgSymbol', e.target.value)}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label>PEO DSN #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approving PEO's DSN Phone Number"
                            value={request.PEO_DSNPhone}
                            onChange={e => updateRequest('PEO_DSNPhone', e.target.value)}
                        />
                    </Col>
                    <Col xl={{ span: 4, offset: 2 }} lg={{ span: 4, offset: 2 }} md="6" sm="6" xs="12">
                        <Form.Label>PEO Comm #</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Approving PEO's Commercial Phone Number"
                            value={request.PEO_CommPhone}
                            onChange={e => updateRequest('PEO_CommPhone', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="6" lg="6" md="8" sm="12" xs="12">
                        <Form.Label>Requirement Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Title of the Requirement being requested"
                            value={request.Title}
                            onChange={e => updateRequest('Title', e.target.value)}
                        />
                    </Col>
                    <Col className="mt-4 mb-3" xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="mr-3 mb-0">Requirement Type:</Form.Label>
                        {Object.values(RequirementTypes).map(type =>
                            <Form.Check inline label={type} type="radio" id={`${type}-radio`}
                                checked={request.RequirementType === type}
                                onClick={() => updateRequest("RequirementType", type)}
                            />)
                        }
                    </Col>
                    <Col className="mt-4 mb-4" xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Check inline label="Is Requirement Funded?" type="checkbox" id="funded-checkbox"
                            checked={showFundingField}
                            onClick={flipShowFundingField}
                        />
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        {showFundingField &&
                            <>
                                <Form.Label>If Yes, Org/PEO funding it:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Org/PEO Funding the Requirement"
                                    value={request.FundingOrgOrPEO}
                                    onChange={e => updateRequest('FundingOrgOrPEO', e.target.value)}
                                />
                            </>
                        }
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        <Form.Label>Application Needed:</Form.Label>
                        <Form.Control
                            as="select"
                            value={request.ApplicationNeeded}
                            onChange={e => updateRequest('ApplicationNeeded', e.target.value)}
                        >
                            {Object.values(ApplicationTypes).map(type => <option>{type}</option>)}
                        </Form.Control>
                    </Col>
                    <Col xl="4" lg="4" md="6" sm="6" xs="12">
                        {request.ApplicationNeeded === ApplicationTypes.OTHER &&
                            <>
                                <Form.Label>If Other, please name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Other Application Needed"
                                    value={request.OtherApplicationNeeded}
                                    onChange={e => updateRequest('OtherApplicationNeeded', e.target.value)}
                                />
                            </>
                        }
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col className="request-vertical-center" xl="3" lg="3" md="6" sm="6" xs="12">
                        <Form.Label>Projected Organizations Impacted:</Form.Label>
                    </Col>
                    <Col className="request-vertical-center" xl="2" lg="3" md="6" sm="6" xs="12">
                        <Form.Check inline label="Is Enterprise?" type="checkbox" id="enterprise-checkbox"
                            checked={request.IsProjectedOrgsEnterprise}
                            onClick={() => updateRequest('IsProjectedOrgsEnterprise', !request.IsProjectedOrgsEnterprise)}
                        />
                    </Col>
                    <Col xl="3" lg="3" md="6" sm="6" xs="12">
                        <Form.Label>Impacted Center:</Form.Label>
                        <Form.Control
                            as="select"
                            value={request.ProjectedOrgsImpactedCenter}
                            onChange={e => updateRequest('ProjectedOrgsImpactedCenter', e.target.value)}
                        >
                            {Object.values(Centers).map(center => <option>{center}</option>)}
                        </Form.Control>
                    </Col>
                    <Col xl="4" lg="3" md="6" sm="6" xs="12">
                        <Form.Label>Impacted Org:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Projected Org Impacted"
                            value={request.ProjectedOrgsImpactedOrg}
                            onChange={e => updateRequest('ProjectedOrgsImpactedOrg', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="5" lg="6" md="6" sm="6" xs="12">
                        <Form.Label>Projected Number of Impacted Users:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Number of Users Impacted by the Requested Application"
                            value={request.ProjectedImpactedUsers}
                            onChange={e => updateRequest('ProjectedImpactedUsers', e.target.value)}
                        />
                    </Col>
                    <Col xl="3" lg="4" md="4" sm="4" xs="12">
                        <CustomInputeDatePicker
                            headerText="Operational Need Date:"
                            date={request.OperationalNeedDate}
                            onChange={date => updateRequest('OperationalNeedDate', date)}
                        />
                    </Col>
                    <Col className="mt-4 mb-3" xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label className="mr-3 mb-0">Organization's Priority:</Form.Label>
                        <Form.Check inline
                            label={<>{OrgPriorities.HIGH} <span className="subtext">(Essential to Deliver)</span></>}
                            type="radio"
                            id={"high-priority-radio"}
                            checked={request.OrgPriority === OrgPriorities.HIGH}
                            onClick={() => updateRequest("OrgPriority", OrgPriorities.HIGH)}
                        />
                        <Form.Check inline
                            label={<>{OrgPriorities.MEDIUM} <span className="subtext">(Functional Capabilities Enhancements)</span></>}
                            type="radio"
                            id={"medium-priority-radio"}
                            checked={request.OrgPriority === OrgPriorities.MEDIUM}
                            onClick={() => updateRequest("OrgPriority", OrgPriorities.MEDIUM)}
                        />
                        <Form.Check inline
                            label={<>{OrgPriorities.LOW} <span className="subtext">(Desire to have/worth Implementing)</span></>}
                            type="radio"
                            id={"low-priority-radio"}
                            checked={request.OrgPriority === OrgPriorities.LOW}
                            onClick={() => updateRequest("OrgPriority", OrgPriorities.LOW)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>Priority Explanation:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Detailed explanation for the priority given..."
                            value={request.PriorityExplanation}
                            onChange={e => updateRequest('PriorityExplanation', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Business Objective: <span className="subtext">(What problem is the business trying to solve?)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={7}
                            placeholder="Detailed explanation of the objective that the business would like this application to achieve..."
                            value={request.BusinessObjective}
                            onChange={e => updateRequest('BusinessObjective', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Functional Requirements: <span className="subtext">(System capabilities for users to perform job efficiently)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={7}
                            placeholder="The system shall provide the ability to..."
                            value={request.FunctionalRequirements}
                            onChange={e => updateRequest('FunctionalRequirements', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Benefits: <span className="subtext">(Time savings, reduce costs, productivity efficiency, etc.)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Benefits this capability will bring to the organization(s) and/or users..."
                            value={request.Benefits}
                            onChange={e => updateRequest('Benefits', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Risks: <span className="subtext">(What is the risk if requirement is not approved and implemented)?</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Detailed explanation of what the risks are for the organization if the requirement is not met..."
                            value={request.Risk}
                            onChange={e => updateRequest('Risk', e.target.value)}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col xl="12" lg="12" md="12" sm="12" xs="12">
                        <Form.Label>
                            Additional Information to Support Request: <span className="subtext">(Optional)</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            placeholder="Any additional information that may be useful when considering this request for approval..."
                            value={request.AdditionalInfo}
                            onChange={e => updateRequest('AdditionalInfo', e.target.value)}
                        />
                    </Col>
                </Form.Row>
            </Form>
        </Container>);
}