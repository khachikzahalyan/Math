import { score10From } from './progressRepo';

describe('score10From', () => {
  it('возвращает 10 при 5/5', () => {
    expect(score10From(5, 5)).toBe(10);
  });
  it('возвращает 8 при 4/5', () => {
    expect(score10From(4, 5)).toBe(8);
  });
  it('возвращает 6 при 3/5', () => {
    expect(score10From(3, 5)).toBe(6);
  });
  it('возвращает 0 при 0/5', () => {
    expect(score10From(0, 5)).toBe(0);
  });
  it('возвращает 0 при total=0 (защита от деления на 0)', () => {
    expect(score10From(0, 0)).toBe(0);
  });
  it('округляет: 7 правильных из 10 → 7', () => {
    expect(score10From(7, 10)).toBe(7);
  });
  it('округляет: 1 из 3 → 3 (Math.round(3.33))', () => {
    expect(score10From(1, 3)).toBe(3);
  });
});
