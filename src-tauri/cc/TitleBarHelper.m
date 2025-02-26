#import <AppKit/AppKit.h>
#include <Symbols/Symbols.h>
#ifdef __cplusplus
extern "C" {
#endif // __cplusplus
void do_something(int tag);
#ifdef __cplusplus
}  // extern "C"
#endif  // __cplusplus


enum {
  kSidebarLeftButtonTag = 0,
  kSidebarRightButtonTag = 1,
  kSwitchButtonTag = 2,
  kSearchButtonTag = 3,
};
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

// 在文件顶部添加自定义按钮类
@interface HoverButton : NSButton
@property (nonatomic, strong) CALayer *hoverLayer;
@end

@implementation HoverButton

- (instancetype)initWithFrame:(NSRect)frameRect {
    self = [super initWithFrame:frameRect];
    if (self) {
        [self setupHoverEffect];
    }
    return self;
}

- (void)setupHoverEffect {
    self.wantsLayer = YES;
    
    // 创建悬停效果层
    self.hoverLayer = [CALayer layer];
    self.hoverLayer.frame = self.bounds;
    self.hoverLayer.cornerRadius = 4.0;
    self.hoverLayer.backgroundColor = [NSColor colorWithWhite:0.5 alpha:0.3].CGColor;
    self.hoverLayer.opacity = 0.0; // 初始时不可见
    [self.layer addSublayer:self.hoverLayer];
    
    // 添加鼠标跟踪区域
    NSTrackingArea *trackingArea = [[NSTrackingArea alloc] initWithRect:self.bounds
                                                                options:(NSTrackingMouseEnteredAndExited | NSTrackingActiveAlways)
                                                                  owner:self
                                                               userInfo:nil];
    [self addTrackingArea:trackingArea];
}

- (void)mouseEntered:(NSEvent *)event {
    // 鼠标进入时显示悬停效果
    self.hoverLayer.opacity = 1.0;
}

- (void)mouseExited:(NSEvent *)event {
    // 鼠标离开时隐藏悬停效果
    self.hoverLayer.opacity = 0.0;
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
  HoverButton *leftButton = [[HoverButton alloc] initWithFrame:NSMakeRect(8, 2, 24, 24)];
  [leftButton setImage:[NSImage imageWithSystemSymbolName:@"sidebar.left"
                                 accessibilityDescription:nil]];
  [leftButton setBezelStyle:NSBezelStyleRegularSquare];
  [leftButton setBordered:NO];
  [leftButton setTag:kSidebarLeftButtonTag];
  [leftButton setTarget:delegate];
  [leftButton setAction:@selector(buttonClicked:)];
  [leftAccessoryView addSubview:leftButton];

  leftAccessoryViewController.view = leftAccessoryView;
  leftAccessoryViewController.layoutAttribute = NSLayoutAttributeLeft;
  [window addTitlebarAccessoryViewController:leftAccessoryViewController];

  // 创建右侧按钮
  NSTitlebarAccessoryViewController *rightAccessoryViewController =
      [[NSTitlebarAccessoryViewController alloc] init];
  NSView *rightAccessoryView = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, 92, 28)];

  // 添加sidebar.right按钮
  HoverButton *sidebarRightButton = [[HoverButton alloc] initWithFrame:NSMakeRect(8, 2, 24, 24)];
  [sidebarRightButton setImage:[NSImage imageWithSystemSymbolName:@"sidebar.right"
                                  accessibilityDescription:nil]];
  [sidebarRightButton setBezelStyle:NSBezelStyleRegularSquare];
  [sidebarRightButton setBordered:NO];
  [sidebarRightButton setTag:kSidebarRightButtonTag];
  [sidebarRightButton setTarget:delegate];
  [sidebarRightButton setAction:@selector(buttonClicked:)];
  [rightAccessoryView addSubview:sidebarRightButton];

  HoverButton *rightButton = [[HoverButton alloc] initWithFrame:NSMakeRect(40, 2, 24, 24)];
  [rightButton setImage:[NSImage imageWithSystemSymbolName:@"lightswitch.on"
                                  accessibilityDescription:nil]];
  [rightButton setBezelStyle:NSBezelStyleRegularSquare];
  [rightButton setBordered:NO];
  [rightButton setTag:kSwitchButtonTag];
  [rightButton setTarget:delegate];
  [rightButton setAction:@selector(buttonClicked:)];
  [rightAccessoryView addSubview:rightButton];

  rightAccessoryViewController.view = rightAccessoryView;
  rightAccessoryViewController.layoutAttribute = NSLayoutAttributeRight;
  [window addTitlebarAccessoryViewController:rightAccessoryViewController];
}