import { IHideawaySelectorOptions } from '../contracts';
import { generateSelector } from '../selector';

describe('middleware -> action -> generateSelector', () => {
  type TState = object;
  it('should return it own state', () => {
    const state: TState = {
      mock: true,
    };
    const options: IHideawaySelectorOptions<TState> = {};
    const result = generateSelector(state, options);
    expect(result).toEqual(state);
  });

  it('should return undefined if it does not have state and has path', () => {
    const state: TState = {};
    const options: IHideawaySelectorOptions<TState> = { path: ['mock'] };
    const result = generateSelector(state, options);
    expect(result).toEqual(undefined);
  });

  it('should return undefined if does not have the path', () => {
    const state: TState = {
      mock: true,
    };
    const options: IHideawaySelectorOptions<TState> = { path: ['hogue'] };
    const result = generateSelector(state, options);
    expect(result).toEqual(undefined);
  });

  it('should return the value if the path is found', () => {
    const state: TState = {
      mock: true,
    };
    const options: IHideawaySelectorOptions<TState> = { path: ['mock'] };
    const result = generateSelector(state, options);
    expect(result).toBeTruthy();
  });
});
