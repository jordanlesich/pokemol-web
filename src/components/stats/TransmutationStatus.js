import React, { useEffect, useState, useContext } from 'react';

import { Legend, PieChart, Pie, Cell } from 'recharts';
import { DaoServiceContext } from '../../contexts/Store';
import { formatCreatedAt } from '../../utils/Helpers';

const TransmutationStatus = (props) => {
  const { setupValues, PIECOLORS, getTokenInfo, data, getRequestToken } = props;
  const [daoService] = useContext(DaoServiceContext);

  const [transDistroInfo, setTransDistroInfo] = useState();

  const pieTransmutationData = (info) => {
    const round =
      daoService.web3.utils.fromWei(info.totalSupply) *
      setupValues.contributionRoundPerc;

    const data = [
      {
        name: 'availible',
        value: +daoService.web3.utils.fromWei(info.transSupply),
      },
      {
        name: 'transmuted',
        value: +'' + (round - daoService.web3.utils.fromWei(info.transSupply)),
      },
    ];
    return data;
  };

  useEffect(() => {
    const tokens = async () => {
      const info = await getTokenInfo('getRequestToken', setupValues.giveToken);

      setTransDistroInfo(pieTransmutationData(info));
    };

    tokens();

    // eslint-disable-next-line
  }, []);

  const total =
    !getRequestToken(data, setupValues.getToken) ||
    getRequestToken(data, setupValues.getToken).tokenBalance == null
      ? 0
      : getRequestToken(data, setupValues.getToken).tokenBalance;

  return (
    <div>
      <h4>Transmutation Status</h4>
      {transDistroInfo ? (
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            startAngle={360}
            endAngle={0}
            data={transDistroInfo}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#8884d8"
            legendType={'circle'}
            label
            labelLine
          >
            {transDistroInfo.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIECOLORS[index % PIECOLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      ) : null}
      <p>
        Start date:{' '}
        {setupValues.startDate ? formatCreatedAt(setupValues.startDate) : 'NA'}
      </p>
      <p>Max monthly burn rate: {setupValues.burnRate * 100}%</p>
      <p>
        Funds Spent:{' '}
        {(
          setupValues.maxCap - daoService.web3.utils.fromWei(total)
        ).toLocaleString('en-US', { maximumFractionDigits: 2 })}
      </p>
      {/* <p>Current avg burn rate: </p> */}
    </div>
  );
};

export default TransmutationStatus;
