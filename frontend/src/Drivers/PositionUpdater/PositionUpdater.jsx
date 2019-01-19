import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Slider, Select, Button } from 'antd';
import Actions from './Actions';
import PositionUpdaterCss from './PositionUpdater.scss';

const hasErrors = (fieldsError) => {
    return Object.keys(fieldsError).some((field) => {
        return fieldsError[field];
    });
};

export class PositionUpdater extends React.PureComponent {
    componentDidMount() {
        this.props.form.validateFields();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.actions.putData({
                    activeLegID: values.leg,
                    legProgress: values.progress
                }, this.props.retrigger);
            }
        });
    }

    render = () => {
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched
        } = this.props.form;

        const legError = isFieldTouched('leg') && getFieldError('leg');
        const progressError = isFieldTouched('progress') && getFieldError('progress');
        if (this.props.disabled) {
            return (
                <div className={PositionUpdaterCss.updaterWrapper}>
                    <h3>Driver Update</h3>
                </div>
            );
        }
        return (
            <div className={PositionUpdaterCss.updaterWrapper}>
                <h3>Driver Update</h3>
                <Form layout="vertical" onSubmit={this.handleSubmit}>
                    <Form.Item
                        validateStatus={legError ? 'error' : ''}
                        help={legError || ''}
                    >
                        {getFieldDecorator('leg', {
                            rules: [{
                                required: true,
                                type: 'enum',
                                enum: this.props.legIDs
                            }],
                            initialValue: this.props.driver.activeLegID
                        })(
                            <Select>
                                {this.props.legIDs.map((legID) => {
                                    return (
                                        <Select.Option key={legID} value={legID}>
                                            {legID}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        validateStatus={progressError ? 'error' : ''}
                        help={progressError || ''}
                    >
                        {getFieldDecorator('progress', {
                            rules: [{
                                required: true,
                                type: 'integer',
                                min: 0,
                                max: 100
                            }],
                            initialValue: this.props.driver.legProgress
                        })(
                            <Slider />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        putStatus: state.putStatus
    };
};

const mapDispatchToProps = (dispatch) => {
    const actions = bindActionCreators(Actions, dispatch);
    return {
        actions
    };
};

// onFieldsChange should propogate to super state to visualize in real-time
const FormedUpdater = Form.create({ name: 'driver-updater', onFieldsChange: console.log })(PositionUpdater);

export default connect(mapStateToProps, mapDispatchToProps)(FormedUpdater);
