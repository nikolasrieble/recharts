import { getTicks } from '../../../src/cartesian/ticks/getTicks';

const EXAMPLE_INPUT = {
  axisLine: true,
  height: 50,
  interval: 'preserveStart' as const,
  label: 'test',
  minTickGap: 5,
  mirror: false,
  orientation: 'bottom' as const,
  stroke: '#666',
  tick: true,
  tickLine: true,
  tickMargin: 2,
  tickSize: 6,
  ticks: [
    { value: '10', coordinate: 50 },
    { value: '1000', coordinate: 100 },
    { value: '20', coordinate: 150 },
    { value: '40', coordinate: 200 },
    { value: '90', coordinate: 250 },
    { value: 'A', coordinate: 300 },
  ],
  length: 5,
  viewBox: { x: 0, y: 0, width: 500, height: 500 },
  width: 400,
  x: 0,
  y: 100,
};

jest.mock('../../../src/util/DOMUtils', () => ({
  // We mock string size measurement, because getStringSize else returns 0 in these tests.
  getStringSize: jest.fn((text: string) => ({ width: text.length, height: 20 })),
}));

// These tests have been generated by merely documenting existing behaviour.
// They will be used to verify that any refactoring does not break the existing behaviour.
describe('getTicks', () => {
  describe('The interval is respected', () => {
    const viewBoxWithSmallWidth = { x: 0, y: 0, width: 30, height: 500 };

    test.each([
      [
        EXAMPLE_INPUT.ticks.length + 1,
        [
          {
            coordinate: 50,
            value: '10',
          },
        ],
      ],
      [
        2,
        [
          {
            coordinate: 50,
            value: '10',
          },
          {
            coordinate: 200,
            value: '40',
          },
        ],
      ],
      [
        1,
        [
          {
            coordinate: 50,
            value: '10',
          },
          {
            coordinate: 150,
            value: '20',
          },
          {
            coordinate: 250,
            value: '90',
          },
        ],
      ],
      [
        0,
        [
          {
            coordinate: 50,
            value: '10',
          },
          {
            coordinate: 100,
            value: '1000',
          },
          {
            coordinate: 150,
            value: '20',
          },
          {
            coordinate: 200,
            value: '40',
          },
          {
            coordinate: 250,
            value: '90',
          },
          {
            coordinate: 300,
            value: 'A',
          },
        ],
      ],
      [
        'preserveStartEnd' as const,
        [
          {
            coordinate: 300,
            isShow: true,
            tickCoord: 29.5,
            value: 'A',
          },
        ],
      ],
      ['preserveStart' as const, []],
      [
        'preserveEnd' as const,
        [
          {
            coordinate: 300,
            isShow: true,
            tickCoord: 29.5,
            value: 'A',
          },
        ],
      ],
      [-1, []],
      [undefined, [{ coordinate: 300, isShow: true, tickCoord: 29.5, value: 'A' }]],
    ])(`interval %s works`, (interval, expectedResult) => {
      const input = {
        ...EXAMPLE_INPUT,
        interval,
        viewBox: viewBoxWithSmallWidth,
      };

      const result = getTicks(input);

      expect(result).toEqual(expectedResult);
    });
  });
});
