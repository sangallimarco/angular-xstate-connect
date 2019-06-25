import { TrimTextPipe } from './trim-text.pipe';

describe('TrimTextPipe', () => {
  it('create an instance', () => {
    const pipe = new TrimTextPipe();
    expect(pipe).toBeTruthy();
  });

  it('trim text', () => {
    const pipe = new TrimTextPipe();
    expect(pipe.transform('  marco ')).toEqual('marco');
  });
});
