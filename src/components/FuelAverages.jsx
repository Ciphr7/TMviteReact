import React, { Component } from 'react';

class FuelAverages extends Component {
    state = {
        data: null,
        loading: true,
        error: null
    };

    static baseUrl = 'https://truckmiles.com';

    async componentDidMount() {
        try {
            const stateAverages = await this.getStateAverages();
            const parsedData = this.parseStateAverages(stateAverages);
            this.setState({ data: parsedData, loading: false });
        } catch (error) {
            console.error('Error fetching or parsing state averages:', error);
            this.setState({ error: 'Error fetching data', loading: false });
        }
    }

    async getStateAverages() {
        try {
            const response = await fetch(`${FuelAverages.baseUrl}/FuelPriceAPI/api/FuelAverage`, { method: 'GET' });
            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error('Error fetching state averages:', error);
        }
    }

    parseStateAverages(stateAverages) {
        const parsedData = {
            dates: {
                current: stateAverages.CurrentDate,
                previous: stateAverages.PreviousDate
            },
            averages: {}
        };

        stateAverages.Averages.forEach(average => {
            parsedData.averages[average.State] = {
                current: average.CurrentAverage,
                previous: average.PreviousAverage,
                diff: average.Different
            };
        });

        return parsedData;
    }

    render() {
        const { data, loading, error } = this.state;

        if (loading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>Error: {error}</div>;
        }

        if (!data) {
            return <div>No data available</div>;
        }

        return (
            <div style={{ maxHeight: "400px", overflowY: "scroll",scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <h2>Fuel Averages</h2>
                <table>
                    <thead style={{ position: "sticky", top: 0, zIndex: 1, background: "#f44336" }}>
                        <tr>
                            <th className='px-2'>State</th>
                            <th className='px-2'>Average</th>
                            <th className='px-2'>Prev Average</th>
                            <th className='px-2'>Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(data.averages).map(state => (
                            <tr key={state}>
                                <td className='px-2'>{state}</td>
                                <td className='px-2'>{data.averages[state].current}</td>
                                <td className='px-2'>{data.averages[state].previous}</td>
                                
                                <td className='px-2'>{data.averages[state].diff.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default FuelAverages;
