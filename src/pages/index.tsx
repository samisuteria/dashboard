import React from "react";
import io from "socket.io-client";
import LineGraph from "../components/LineGraph";
import DataPoint from "../models/dataPoint";

interface IndexState {
  lastValue: DataPoint;
  values: DataPoint[];
}

class Index extends React.Component<any, IndexState> {
  public socket: SocketIOClient.Socket;

  constructor(props: any) {
    super(props);
    this.state = {
      lastValue: {
        date: new Date(),
        temperature: 0,
      },
      values: [],
    };
  }

  public componentDidMount() {
    this.socket = io("http://localhost:9000");
    this.socket.on("update", (value: number) => {
      const dataPoint: DataPoint = {
        date: new Date(),
        temperature: value,
      };

      const newValues = this.state.values;
      newValues.push(dataPoint);

      if (newValues.length > 100) {
        newValues.shift();
      }

      this.setState({
        lastValue: dataPoint,
        values: newValues,
      });
    });
  }

  public render() {
    return (
      <div>
        <p>Dashboard</p>
        <p>New Value: {this.state.lastValue.temperature}, Count: {this.state.values.length}</p>
        <LineGraph height={500} width={960} values={this.state.values}/>
      </div>
    );
  }
}

export default Index;