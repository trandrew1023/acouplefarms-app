import { React, useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  getOrgLocationColumns,
  getOrgLocationStatsBetween,
} from '../service';
import BasicDateRangePicker from './BasicDateRangePicker';

export default function StatLineChart() {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [columns, setColumns] = useState(null);
  const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;

  const getOffsetDate = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
  };

  const getISODate = (dateToConvert) => (
    new Date(dateToConvert - timezoneOffset).toISOString().split('T')[0]
  );

  const [dateRange, setDateRange] = useState([getOffsetDate(-7), getOffsetDate(0)]);

  const retrieveStats = async (startDate, endDate) => {
    setIsLoading(true);
    const newChartData = [];
    const orgLocationStatsResponse = await getOrgLocationStatsBetween(
      state.organization.id,
      startDate,
      endDate,
    );
    const orgLocationColumnsResponse = await getOrgLocationColumns(state.organization.id);
    orgLocationStatsResponse.forEach(
      (row) => {
        const temp = new Map();
        row.locationStatResponses.forEach((stat) => {
          Object.keys(stat.locationColumnIdToValue).forEach((key) => {
            if (temp.has(key)) {
              temp.set(key, +temp.get(key) + +stat.locationColumnIdToValue[key]);
            } else {
              temp.set(key, stat.locationColumnIdToValue[key]);
            }
          });
        });
        const dayObj = Object.fromEntries(temp);
        Object.assign(dayObj, { date: new Date(row.date).toISOString().split('T')[0] });
        newChartData.push(dayObj);
      },
    );
    setChartData(newChartData);
    setColumns(orgLocationColumnsResponse);
    setIsLoading(false);
  };

  useEffect(async () => {
    document.title = `${state.organization.name} - Stats - aCOUPlefarms`;
    window.scrollTo(0, 0);
    retrieveStats(getISODate(dateRange[0]), getISODate(dateRange[1]));
  }, []);

  // const stringToColor = (string) => {
  //   /* eslint-disable no-bitwise */
  //   const stringUniqueHash = [...string].reduce((acc, char) => (
  //     char.charCodeAt(0) + ((acc << 5) - acc)
  //   ), 0);
  //   return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
  //   /* eslint-enable no-bitwise */
  // };

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const changeDates = (newDateRange) => {
    setDateRange(newDateRange);
    retrieveStats(getISODate(newDateRange[0]), getISODate(newDateRange[1]));
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <Typography
            noWrap
            variant="h3"
            sx={{
              mt: '70px',
              width: '90vw',
              textAlign: 'center',
            }}
          >
            {state.organization.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mt: 3 }}>
          <BasicDateRangePicker dateRange={dateRange} setDateRange={changeDates} />
        </Grid>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              ml: -3,
              mt: 2,
              overflow: 'hidden',
            }}
          >
            {
              isLoading ? <CircularProgress sx={{ color: 'primary.loading' }} />
                : (
                  <LineChart
                    width={window.innerWidth * 0.9}
                    height={window.innerHeight * 0.4}
                    data={chartData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={
                        (label) => {
                          if (label) return label.substring(5);
                          return label;
                        }
                      }
                    />
                    <YAxis domain={[0, 'dataMax']} />
                    <Tooltip />
                    <Legend />
                    {columns && columns.map((column) => (
                      <Line
                        key={column.id}
                        type="monotone"
                        dataKey={column.id}
                        name={column.name}
                        stroke={stringToColor(column.name)}
                      />
                    ))}
                  </LineChart>
                )
            }
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
