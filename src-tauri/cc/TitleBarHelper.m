#import <AppKit/AppKit.h>
#ifdef __cplusplus
extern "C" {
#endif // __cplusplus
void do_something(int tag);
#ifdef __cplusplus
}  // extern "C"
#endif  // __cplusplus
@protocol CustomizationTitleBarDelegate <NSObject>
- (void)buttonClicked:(id)sender;
@end

@interface TitleBarHelper : NSObject <CustomizationTitleBarDelegate>
@end

@implementation TitleBarHelper
- (void)buttonClicked:(NSButton *)sender {
  do_something(sender.tag);
}
@end

void init_title(void *ns_window) {
  NSWindow *window = (__bridge NSWindow *)ns_window;
  TitleBarHelper *delegate = [[TitleBarHelper alloc] init];

  window.title = @"";

  // 获取标题栏视图
  NSTitlebarAccessoryViewController *leftAccessoryViewController =
      [[NSTitlebarAccessoryViewController alloc] init];
  NSView *leftAccessoryView = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, 60, 28)];

  // 创建左侧按钮
  NSButton *leftButton = [[NSButton alloc] initWithFrame:NSMakeRect(8, 2, 24, 24)];
  [leftButton setImage:[NSImage imageWithSystemSymbolName:@"sidebar.left"
                                 accessibilityDescription:nil]];
  [leftButton setBezelStyle:NSBezelStyleRegularSquare];
  [leftButton setBordered:NO];
  [leftButton setTag:0];
  [leftButton setTarget:delegate];
  [leftButton setAction:@selector(buttonClicked:)];
  [leftAccessoryView addSubview:leftButton];

  leftAccessoryViewController.view = leftAccessoryView;
  leftAccessoryViewController.layoutAttribute = NSLayoutAttributeLeft;
  [window addTitlebarAccessoryViewController:leftAccessoryViewController];

  // 创建右侧按钮
  NSTitlebarAccessoryViewController *rightAccessoryViewController =
      [[NSTitlebarAccessoryViewController alloc] init];
  NSView *rightAccessoryView = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, 60, 28)];

  NSButton *rightButton = [[NSButton alloc] initWithFrame:NSMakeRect(8, 2, 24, 24)];
  [rightButton setImage:[NSImage imageWithSystemSymbolName:@"sidebar.right"
                                  accessibilityDescription:nil]];
  [rightButton setBezelStyle:NSBezelStyleRegularSquare];
  [rightButton setBordered:NO];
  [rightButton setTag:1];
  [rightButton setTarget:delegate];
  [rightButton setAction:@selector(buttonClicked:)];
  [rightAccessoryView addSubview:rightButton];

  rightAccessoryViewController.view = rightAccessoryView;
  rightAccessoryViewController.layoutAttribute = NSLayoutAttributeRight;
  [window addTitlebarAccessoryViewController:rightAccessoryViewController];
}