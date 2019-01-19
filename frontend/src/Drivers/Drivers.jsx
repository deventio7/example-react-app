import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from './Actions';
import DriversCss from './Drivers.scss';
import PositionUpdater from './PositionUpdater';

const DRAW_POSITIONS = 200;
const LEG_DRAW_WIDTH = 3;
const STOP_DRAW_SIZE = 6;
const STOP_DRAW_RADIUS = 4; // must be smaller than STOP_DRAW_SIZE
const STOP_FONT_SIZE = 8;
const DRIVER_SIZE = 10;

export class Drivers extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.state = {
            hasData: false,
            totalTime: 0,
            remainTime: 0,
            previewDriver: {
                activeLegID: '',
                legProgress: 0
            }
        };
    }

    getDataAndUpdate = () => {
        this.props.actions.getData(() => {
            const { driver } = this.props.driverData.data;
            this.setState({
                hasData: true,
                totalTime: this.calculateRemainingTime({ activeLegID: '' }),
                remainTime: this.calculateRemainingTime(driver),
                previewDriver: driver
            });
        });
    }

    componentDidMount = () => {
        this.getDataAndUpdate();
    }

    drawCanvas = ({ stops, legs, driver }) => {
        this.canvas.current.width = this.canvas.current.offsetWidth;
        this.canvas.current.height = this.canvas.current.offsetWidth;
        const resize = (coordinate) => {
            return (coordinate + 1) * this.canvas.current.height / (DRAW_POSITIONS + 2);
        };
        const driverCoordinates = [resize(
            stops[driver.activeLegID.substring(0, 1)].x * (100 - driver.legProgress) / 100
            + stops[driver.activeLegID.substring(1)].x * driver.legProgress / 100
        ), resize(
            stops[driver.activeLegID.substring(0, 1)].y * (100 - driver.legProgress) / 100
            + stops[driver.activeLegID.substring(1)].y * driver.legProgress / 100
        )];

        const ctx = this.canvas.current.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.width);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = LEG_DRAW_WIDTH;
        ctx.strokeStyle = 'green';

        ctx.beginPath();
        ctx.moveTo(resize(stops.A.x), resize(stops.A.y));
        legs.forEach((leg) => {
            if (leg.legID === driver.activeLegID) {
                ctx.lineTo(...driverCoordinates);
                ctx.stroke();
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(...driverCoordinates);
                ctx.lineTo(resize(stops[leg.endStop].x), resize(stops[leg.endStop].y));
            } else {
                ctx.lineTo(resize(stops[leg.endStop].x), resize(stops[leg.endStop].y));
            }
        });
        ctx.stroke();

        ctx.lineWidth = STOP_DRAW_SIZE;
        ctx.font = `${STOP_FONT_SIZE}px`;
        Object.keys(stops).forEach((stopKey) => {
            ctx.strokeStyle = 'black';
            ctx.beginPath();
            ctx.arc(
                resize(stops[stopKey].x),
                resize(stops[stopKey].y),
                STOP_DRAW_RADIUS, 0, 2 * Math.PI
            );
            ctx.stroke();
            ctx.fillStyle = 'white';
            ctx.fillText(stopKey,
                resize(stops[stopKey].x) - STOP_FONT_SIZE / 2,
                resize(stops[stopKey].y) + STOP_FONT_SIZE / 2 - 1);
        });

        const prvwDriver = this.state.previewDriver;
        const prvwDriverCoordinates = [resize(
            stops[prvwDriver.activeLegID.substring(0, 1)].x * (100 - prvwDriver.legProgress) / 100
            + stops[prvwDriver.activeLegID.substring(1)].x * prvwDriver.legProgress / 100
        ), resize(
            stops[prvwDriver.activeLegID.substring(0, 1)].y * (100 - prvwDriver.legProgress) / 100
            + stops[prvwDriver.activeLegID.substring(1)].y * prvwDriver.legProgress / 100
        )];
        ctx.fillStyle = 'rgba(0,255,0,0.5)';
        ctx.fillRect(
            prvwDriverCoordinates[0] - DRIVER_SIZE / 2, prvwDriverCoordinates[1] - DRIVER_SIZE / 2,
            DRIVER_SIZE, DRIVER_SIZE
        );

        ctx.fillStyle = 'green';
        ctx.fillRect(
            driverCoordinates[0] - DRIVER_SIZE / 2, driverCoordinates[1] - DRIVER_SIZE / 2,
            DRIVER_SIZE, DRIVER_SIZE
        );
    }

    updatePreviewDriver = (newPreviewDriver) => {
        this.setState((state) => {
            return {
                ...state,
                previewDriver: {
                    ...state.previewDriver,
                    ...newPreviewDriver
                }
            };
        });
    }

    calculateRemainingTime(driver) {
        const { legs, stops } = this.props.driverData.data;
        return legs.reduce((acc, leg) => {
            if (leg.legID > driver.activeLegID) {
                return acc + Math.sqrt(
                    ((stops[leg.startStop].x - stops[leg.endStop].x) ** 2)
                    + ((stops[leg.startStop].y - stops[leg.endStop].y) ** 2)
                );
            }
            if (leg.legID === driver.activeLegID) {
                return acc + (100 - driver.legProgress) / 100 * Math.sqrt(
                    ((stops[leg.startStop].x - stops[leg.endStop].x) ** 2)
                    + ((stops[leg.startStop].y - stops[leg.endStop].y) ** 2)
                );
            }
            return acc;
        }, 0);
    }

    render = () => {
        let legIDs = [];
        if (this.state.hasData && this.canvas.current) {
            this.drawCanvas(this.props.driverData.data);
            legIDs = this.props.driverData.data.legs.map((leg) => {
                return leg.legID;
            });
        }
        const totalTime = [
            Math.floor(this.state.totalTime),
            Math.floor((this.state.totalTime % 1) * 60),
            Math.floor((((this.state.totalTime % 1) * 60) % 1) * 60)
        ];
        const remTime = [
            Math.floor(this.state.remainTime),
            Math.floor((this.state.remainTime % 1) * 60),
            Math.floor((((this.state.remainTime % 1) * 60) % 1) * 60)
        ];
        const prvwFullTime = this.calculateRemainingTime(this.state.previewDriver);
        const prvwTime = [
            Math.floor(prvwFullTime),
            Math.floor((prvwFullTime % 1) * 60),
            Math.floor((((prvwFullTime % 1) * 60) % 1) * 60)
        ];
        return (
            <div>
                <h1 className={DriversCss.title}>Driver Status</h1>
                <div className={DriversCss.displaySidebar}>
                    <PositionUpdater
                        retrigger={this.getDataAndUpdate}
                        updatePreview={this.updatePreviewDriver}
                        legIDs={legIDs}
                        driver={this.props.driverData.data.driver}
                        disabled={!this.state.hasData}
                    />
                    <div className={DriversCss.calculatedTimes}>
                        <h3>Time Information</h3>
                        <div className={DriversCss.timeDisplayLine}>
                            {`Round-trip time: ${totalTime[0]}h ${totalTime[1]}m ${totalTime[2]}s`}
                        </div>
                        <div className={DriversCss.timeDisplayLine}>
                            {`Time remaining: ${remTime[0]}h ${remTime[1]}m ${remTime[2]}s`}
                        </div>
                        <div className={DriversCss.timeDisplayLine}>
                            {`New Position: ${prvwTime[0]}h ${prvwTime[1]}m ${prvwTime[2]}s`}
                        </div>
                    </div>
                </div>
                <canvas className={DriversCss.canvas} ref={this.canvas} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        driverData: state.driverData
    };
};

const mapDispatchToProps = (dispatch) => {
    const actions = bindActionCreators(Actions, dispatch);
    return {
        actions
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Drivers);
