export class StatService {
  // private googleService: GoogleService;
  // private userRepository: UserRepository;
  // constructor() {
  //   this.googleService = new GoogleService();
  //   this.userRepository = new UserRepository();
  // }
  // async signInGoogle(idToken: string) {
  //   const payload = await this.googleService.verify(idToken);
  //   let user = null;
  //   user = await this.userRepository.findUnique(payload);
  //   if (!user) {
  //     user = await this.userRepository.create(payload);
  //   }
  //   const authToken = jwt.sign({ name: payload?.name, email: payload?.email }, process.env.JWT_SECRET as string);
  //   const role = payload?.email === process.env.ADMIN_EMAIL ? 'admin' : 'customer';
  //   return {
  //     authToken,
  //     user,
  //     role,
  //   };
  // }
}
