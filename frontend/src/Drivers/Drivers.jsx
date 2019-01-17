import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Actions from './Actions';
import DriversCss from './Drivers.scss';

export class Drivers extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount = () => {
        this.props.actions.getData();
    }

    drawCanvas = ({ stops, legs, driver }) => {
        this.canvas.current.height = this.canvas.current.offsetWidth;
        this.canvas.current.width = this.canvas.current.offsetWidth;
        const resize = (coordinate) => {
            return (coordinate + 1) * this.canvas.current.height / 202;
        };
        const ctx = this.canvas.current.getContext('2d');
        const stopMap = stops.reduce((acc, ele) => {
            acc[ele.name] = {
                x: ele.x,
                y: ele.y
            };
            return acc;
        }, {});
        const sortedLegs = legs.sort((leg1, leg2) => {
            return leg1.startStop < leg2.startStop ? -1 : 1;
        });
        const driverCoordinates = [resize(
            stopMap[driver.activeLegID.substring(0, 1)].x * driver.legProgress / 100
            + stopMap[driver.activeLegID.substring(1)].x * (100 - driver.legProgress) / 100
        ), resize(
            stopMap[driver.activeLegID.substring(0, 1)].y * driver.legProgress / 100
            + stopMap[driver.activeLegID.substring(1)].y * (100 - driver.legProgress) / 100
        )];

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'green';

        ctx.beginPath();
        ctx.moveTo(resize(stopMap.A.x), resize(stopMap.A.y));
        sortedLegs.forEach((leg) => {
            if (leg.legID === driver.activeLegID) {
                ctx.lineTo(...driverCoordinates);
                ctx.stroke();
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(...driverCoordinates);
                ctx.lineTo(resize(stopMap[leg.endStop].x), resize(stopMap[leg.endStop].y));
            } else {
                ctx.lineTo(resize(stopMap[leg.endStop].x), resize(stopMap[leg.endStop].y));
            }
        });
        ctx.stroke();
    }

    render = () => {
        if (this.props.driverData.isFulfilled && this.canvas.current) {
            this.drawCanvas(this.props.driverData.data);
        }
        return (
            <div>
                <h1 className={DriversCss.title}>Driver Status</h1>
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
