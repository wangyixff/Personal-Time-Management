import { PersonalTimeManagementPage } from './app.po';

describe('personal-time-management App', () => {
  let page: PersonalTimeManagementPage;

  beforeEach(() => {
    page = new PersonalTimeManagementPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
