import { getTicks } from '../../../src/cartesian/getTicks';
import { CartesianTickItem } from '../../../src/util/types';

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
  describe('ticks are always shown if there is space', () => {
    test('preserveEnd', () => {
      const input = { ...EXAMPLE_INPUT, interval: 'preserveEnd' as const };

      const result = getTicks(input);

      expect(result).toEqual([
        { value: '10', coordinate: 50, tickCoord: 50, isShow: true },
        { value: '1000', coordinate: 100, tickCoord: 100, isShow: true },
        { value: '20', coordinate: 150, tickCoord: 150, isShow: true },
        { value: '40', coordinate: 200, tickCoord: 200, isShow: true },
        { value: '90', coordinate: 250, tickCoord: 250, isShow: true },
        { value: 'A', coordinate: 300, tickCoord: 300, isShow: true },
      ]);
    });

    test('preserveStart', () => {
      const input = { ...EXAMPLE_INPUT, interval: 'preserveStart' as const };

      const result = getTicks(input);

      expect(result).toEqual([
        { value: '10', coordinate: 50, tickCoord: 50, isShow: true },
        { value: '1000', coordinate: 100, tickCoord: 100, isShow: true },
        { value: '20', coordinate: 150, tickCoord: 150, isShow: true },
        { value: '40', coordinate: 200, tickCoord: 200, isShow: true },
        { value: '90', coordinate: 250, tickCoord: 250, isShow: true },
        { value: 'A', coordinate: 300, tickCoord: 300, isShow: true },
      ]);
    });
  });

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
      [
        'equidistantPreserveStart' as const,
        [
          {
            coordinate: 50,
            tickCoord: 50,
            value: '10',
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

  describe('Equidistant ticks are shown depending on label width and space between ticks', () => {
    test.each([
      // With enough space, all ticks are shown.
      [['11111111111111', '2', '3', '4'], 20, ['11111111111111', '2', '3', '4']],
      [['1', '22222222222222', '3', '4'], 20, ['1', '22222222222222', '3', '4']],
      [['1', '2', '33333333333333', '4'], 20, ['1', '2', '33333333333333', '4']],
      [['1', '2', '3', '44444444444444'], 20, ['1', '2', '3', '44444444444444']],

      // If not enough space is available we show only every nTH.
      [['11111111111111', '2', '3', '4'], 5, ['11111111111111', '4']], // every 3rd
      [['1', '22222222222222', '3', '4'], 5, ['1', '3']], // every 2nd
      [['1', '2', '33333333333333', '4'], 5, ['1', '4']], // every 3rd
      [['1', '2', '3', '44444444444444'], 5, ['1', '3']], // every 2nd

      // If not enough space is available at all, we only show the first tick.
      [['11111111111111', '2', '3', '4'], 1, ['11111111111111']],
      [['1', '22222222222222', '3', '4'], 1, ['1']],
      [['1', '2', '33333333333333', '4'], 1, ['1']],
      [['1', '2', '3', '44444444444444'], 1, ['1']],
    ])(
      `equidistantPreserveStart spaces nicely for %s and tick step of %s`,
      (tickValues, tickWidthStep, expectedResult) => {
        const ticks = tickValues.map((value, index) => ({ value, coordinate: tickWidthStep * (index + 1) }));
        const input = {
          ...EXAMPLE_INPUT,
          interval: 'equidistantPreserveStart' as const,
          ticks,
        };

        const resultingTickValues = (getTicks(input) as CartesianTickItem[]).map(tick => tick.value);

        expect(resultingTickValues).toEqual(expectedResult);
      },
    );
  });
});
