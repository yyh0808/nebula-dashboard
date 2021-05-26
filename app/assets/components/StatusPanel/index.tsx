import React from 'react';
import intl from 'react-intl-universal';
import { IDispatch } from '@assets/store';
import { connect } from 'react-redux';
import { NEBULA_COUNT } from '@assets/utils/promQL';
import { DETAIL_DEFAULT_RANGE } from '@assets/utils/dashboard';
import { SERVICE_POLLING_INTERVAL } from '@assets/utils/service';


import './index.less';

const mapState = () => {
  return {
  };
};


const mapDispatch = (dispatch: IDispatch) => {
  return {
    asyncGetStatus: dispatch.service.asyncGetStatus,
  };
};

interface IProps extends ReturnType<typeof mapDispatch>{
  type: string
}

interface IState {
  normal: number,
  abnormal: number,
}
class StatusPanel extends React.PureComponent<IProps, IState> {
  pollingTimer: any;
  constructor (props: IProps) {
    super(props);
    this.state = {
      normal: 0,
      abnormal: 0
    };
  }
  componentDidMount () {
    this.pollingData();
  }


  pollingData = () => {
    this.asyncGetStatus();
    this.pollingTimer = setTimeout(this.pollingData, SERVICE_POLLING_INTERVAL);
  }

  componentWillUnmount () {
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
    }
  }

  asyncGetStatus = async () => {
    const { type } = this.props;
    const { normal, abnormal } = await this.props.asyncGetStatus({
      query: NEBULA_COUNT[type],
      end: Date.now(),
      interval:DETAIL_DEFAULT_RANGE,
    });
    this.setState({ normal, abnormal });
  } 

  render () {
    const { normal, abnormal } = this.state;
    return (
      <ul className="status-panel">
        <li className="normal">{intl.get('service.normal')}: <span>{normal}</span></li>
        <li className="abnormal">{intl.get('service.abnormal')}: <span>{abnormal}</span></li>
      </ul>
    );
  }
}

export default connect(mapState, mapDispatch)(StatusPanel);